// Transform the Companies House JSON to the IDENTITY-VAULT Schema
function mapToIdentityVault(companyData) {
    return {
        vault_node: "BRIDGE-39",
        entity_type: "CORPORATE_ENTITY",
        anchored_at: new Date().toISOString(),
        payload: {
            id: companyData.company_number,
            name: companyData.company_name,
            jurisdiction: companyData.jurisdiction,
            sic_codes: companyData.sic_codes,
            status: companyData.company_status,
            registration_date: companyData.date_of_creation,
            office: {
                address: companyData.registered_office_address.address_line_1,
                postal_code: companyData.registered_office_address.postal_code,
                country: companyData.registered_office_address.country
            },
            etag: companyData.etag
        }
    };
}

// Example usage:
// const vaultPayload = mapToIdentityVault(companyJsonResponse);
// console.log(JSON.stringify(vaultPayload, null, 2));