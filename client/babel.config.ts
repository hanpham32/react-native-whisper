module.exports = {
  plugins: [
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env.local',
        path: '.env.local',
      },
    ],
  ],
};
