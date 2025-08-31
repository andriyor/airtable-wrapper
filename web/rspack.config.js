const { RsdoctorRspackPlugin } = require("@rsdoctor/rspack-plugin");

module.exports = {
  plugins: [
    new RsdoctorRspackPlugin({
      supports: {
        banner: true,
      },
    }),
  ],
};
