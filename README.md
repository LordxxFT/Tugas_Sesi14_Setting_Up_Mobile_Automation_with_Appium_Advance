Run test:
- npm run test

Find appActivity and appPackage
- open app first, and leave in first screen / home screen
- run command: adb shell dumpsys activity activities | findstr "ResumedActivity"
  - example output: ResumedActivity: ActivityRecord{abcd123 io.appium.android.apis/io.appium.android.apis.ApiDemos}
  - appPackage = io.appium.android.apis
  - appActivity = io.appium.android.apis.ApiDemos