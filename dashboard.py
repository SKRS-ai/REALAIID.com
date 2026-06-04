import streamlit as st
import pandas as pd
from PIL import Image
from tower_aggregator import ControlTowerAggregator

# Page setup
st.set_page_config(page_title="RoboSign™ Fleet Control Tower", layout="wide")

# --- AUTHENTICATION & AUTHORIZATION ---
# Safely check if OIDC is configured and user is logged in
if not (hasattr(st, 'user') and getattr(st.user, 'is_logged_in', False)):
    st.login("oidc")
    st.stop()

# Role Mapping Logic
ROLES = {"OPERATOR": 1, "SUPERVISOR": 2, "ADMIN": 3, "FINANCIAL": 4}

def map_email_to_role(email):
    """Assigns role based on email domain or pattern."""
    if "admin" in email: return "ADMIN"
    if "finance" in email: return "FINANCIAL"
    if "supervisor" in email: return "SUPERVISOR"
    return "OPERATOR"

# Set session role upon login
if "user_role" not in st.session_state:
    st.session_state["user_role"] = map_email_to_role(st.user.email)

def check_permission(required_role):
    """Checks if the user's role meets the level requirements."""
    current_role = st.session_state.get("user_role", "OPERATOR")
    return ROLES.get(current_role, 0) >= ROLES.get(required_role, 0)

# Sidebar Auth Info
st.sidebar.markdown(f"**Logged in as:** {st.user.email}")
st.sidebar.button("Logout", on_click=st.logout)

# 1. Conditional Formatting Logic
def highlight_status_rows(row):
    text_color = 'color: black;'
    identity = row.get('robosign_identity', '')
    balance = row.get('aii_balance', 1000)
    if identity == 'PENDING' or balance < 100:
        return [f'background-color: #ffcccc; {text_color}'] * len(row)
    return [f'background-color: #ffffff; {text_color}'] * len(row)

# 2. Aggregator
@st.cache_resource
def get_aggregator():
    return ControlTowerAggregator()

aggregator = get_aggregator()

# 3. Professional Header
col_logo, col_title = st.columns([1, 5])
with col_logo:
    try:
        logo = Image.open("public/RoboSign.png")
        st.image(logo, width=120)
    except FileNotFoundError:
        st.write("Logo missing")
with col_title:
    st.title("RoboSign™ Fleet Control Tower")

st.divider()

# --- MAIN UI NAVIGATION ---
tab1, tab2 = st.tabs(["Fleet Operations", "Financial Admin"])

with tab1:
    st.subheader("Live Fleet Status")
    peers = aggregator.ledger.get_fleet_status()

    if peers:
        df = pd.DataFrame(peers)
        col1, col2 = st.columns(2)
        col1.metric("Active Robots", len(df[df['status'] == 'ACTIVE']) if 'status' in df.columns else 0)
        col2.metric("Total Fleet", len(df))
        
        all_required_cols = ['node_id', 'status', 'robosign_identity', 'aii_balance', 'compliance_status']
        available_cols = [c for c in all_required_cols if c in df.columns]
        styled_df = df[available_cols].style.apply(highlight_status_rows, axis=1)
        
        event = st.dataframe(styled_df, use_container_width=True, on_select="rerun", selection_mode="single-row")
        
        if event.selection["rows"]:
            selected_index = event.selection["rows"][0]
            selected_robot = df.iloc[selected_index]
            st.divider()
            st.subheader(f"Command Center: {selected_robot['node_id']}")
            col_a, col_b, col_c = st.columns(3)
            
            if check_permission("SUPERVISOR"):
                if col_a.button("🔄 Re-Verify Identity"): st.success(f"Identity challenge sent to {selected_robot['node_id']}")
                if col_b.button("⚡ Remote Reset"): st.warning(f"Reset command sent to {selected_robot['node_id']}")
            else:
                col_a.write("🔒 View Only")
                col_b.write("🔒 View Only")

            if check_permission("ADMIN"):
                if col_c.button("⚠️ Emergency Stop"): st.error(f"EMERGENCY STOP engaged for {selected_robot['node_id']}")
            else:
                col_c.write("🔒 Admin Only")

        st.divider()
        st.subheader("Facility Map: Robot Positioning")
        if 'x_coord' in df.columns and 'y_coord' in df.columns:
            st.scatter_chart(df, x='x_coord', y='y_coord', color='status', size=100)
        
        st.divider()
        st.subheader("Task Allocation Feed")
        pending_tasks = aggregator.ledger.get_pending_tasks()
        if pending_tasks: st.dataframe(pd.DataFrame(pending_tasks), use_container_width=True)

        st.divider()
        st.subheader("System Audit Trail")
        search_node = st.text_input("Search by Node ID")
        logs = aggregator.ledger.get_audit_logs(node_id=search_node if search_node else None)
        if logs: st.dataframe(pd.DataFrame(logs), use_container_width=True)

with tab2:
    if check_permission("FINANCIAL"):
        st.subheader("RoboSign™ Financial Control")
        col_f1, col_f2 = st.columns(2)
        col_f1.metric("Total Escrow Balance", "$45,200.00")
        col_f2.metric("Pending Payouts", "$1,250.00")
        st.divider()
        if st.button("Authorize Monthly Fleet Maintenance Budget"):
            st.success("Budget authorized.")
    else:
        st.error("🔒 Access Denied: Financial/Owner role required.")