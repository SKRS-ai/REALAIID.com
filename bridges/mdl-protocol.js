/**
 * ISO/IEC 18013-5 mDL Verifier
 */
exports.verifyPresentation = async (req, res) => {
    const { mDL_data, signature } = req.body;
    
    // 1. Verify ISO/IEC 18013-5 signature
    const isValid = await require('./security').verifyMdlSignature(mDL_data, signature);
    
    if (isValid) {
        res.json({ status: 'SUCCESS', message: 'Federal mDL verified.' });
    } else {
        res.status(403).json({ error: 'mDL verification failed.' });
    }
};