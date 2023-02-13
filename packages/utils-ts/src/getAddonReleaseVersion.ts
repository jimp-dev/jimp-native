export const getAddonReleaseVersion = () => !!process.env.JIMP_NATIVE_DEBUG
    ? 'Debug'
    : 'Release';