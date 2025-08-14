import { expect } from 'chai';

// Function to generate random string
function generateRandomString(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

describe('Appium DEMO App Felix', () => {

  before(async () => {
    console.log('Starting Appium DEMO App Felix tests.................................');
  });

  afterEach(async () => {

    // Terminate the app (if running)
    await browser.execute('mobile: terminateApp', { appId: 'io.appium.android.apis' });

    // Short delay to ensure app is closed
    await browser.pause(1000);

    // Start the app again
    await browser.execute('mobile: activateApp', { appId: 'io.appium.android.apis' });
  });

  after(async () => {
    console.log('Finished Appium DEMO App Felix tests.................................');
  });

  it('Klik elemen', async () => {
    // menu: home page
    const elemenKlik = await $(`//android.widget.TextView[@content-desc="Accessibility"]`);
    await elemenKlik.click();
  });
  
  it('Input ke elemen', async () => {
    // menu: App > Alert Dialogs > Text Entry dialog

    // locator-locator nya
    const appMenu = await $(`//android.widget.TextView[@content-desc="App"]`)
    const alertdialogMenu = await $(`//android.widget.TextView[@content-desc="Alert Dialogs"]`)
    const textentryMenu = await $(`//android.widget.Button[@content-desc="Text Entry dialog"]`)
    
    // action buat masuk ke popup nya 
    await appMenu.click();
    await alertdialogMenu.click();
    await textentryMenu.click();

    // press button back di device
    // await browser.back()
    

    // start input elemen
    
    const nameField = await $('//android.widget.EditText[@resource-id="io.appium.android.apis:id/username_edit"]')
    const passField = await $('//android.widget.EditText[@resource-id="io.appium.android.apis:id/password_edit"]')

    const passwordRandom = generateRandomString(10);
    await nameField.setValue('admin_felix');
    await passField.setValue(passwordRandom);
    
    // console.log(`Username yang diinput: ` + nameField.getValue());
    // console.log(`Password yang diinput:` + passField.getValue());
  });
  
  it('Memastikan tulisan pada button', async() =>{
    // app > activity > animation
    const buttonApp = await $('//android.widget.TextView[@content-desc="App"]')
    const buttonActivity = await $('//android.widget.TextView[@content-desc="Activity"]')
    const buttonAnimation = await $('//android.widget.TextView[@content-desc="Animation"]')
    const buttonSatu = await $('//android.widget.Button[@index=1]')
    
    // masuk ke page nya dulu
    await buttonApp.click();
    await buttonActivity.click();
    await buttonAnimation.click();

    // ambil text di element nya
    const tulisanDiButton = await buttonSatu.getText()

    // validasi value nya
    expect(tulisanDiButton).to.equal("Fade in")
  })

  it('Memastikan App bisa terbuka dan elemen tersedia', async () => {
    const accessibilityMenu = await $(`//android.widget.TextView[@content-desc="Accessibility"]`);

    // Wait, then click
    await accessibilityMenu.waitForDisplayed({ timeout: 10000 });
    const isVisible = await accessibilityMenu.isDisplayed();
    expect(isVisible).to.be.true;

    // contoh2 validasi yg lain
    // const nilai = 99999999999
    // expect(nilai).to.be.greaterThanOrEqual(10)

    const nama = "andi"
    expect(nama).to.equals("luki")

  });

  it('Swipe elemen hard-coded', async () => {
    // menu: Views > Gallery > 1. Photos
    const viewsMenu = await $(`//android.widget.TextView[@content-desc="Views"]`);
    const galleryMenu = await $(`//android.widget.TextView[@content-desc="Gallery"]`);
    const photosMenu = await $(`//android.widget.TextView[@content-desc="1. Photos"]`);
    await viewsMenu.click();
    await galleryMenu.click();
    await photosMenu.click();

    // pastikan elemen Gallery terlihat
    const galleryWidget = await $(`//android.widget.Gallery[@resource-id="io.appium.android.apis:id/gallery"]`);
    await galleryWidget.waitForDisplayed({ timeout: 10000 });
    const isGalleryVisible = await galleryWidget.isDisplayed();
    expect(isGalleryVisible).to.be.true;

    // Appium 2.x SUpport
    // touchAction sudah tidak di support since Appium 2.x (sudah menggunakan W3C Actions API)
    // hitung size elemen yang ingin swipe
    const location = await galleryWidget.getLocation();
    const size = await galleryWidget.getSize();
    const y = location.y + size.height / 2;
    const startX = location.x + size.width - 10;
    const endX = location.x + 10;

    // mulai swipe
    await browser.performActions([{
      type: 'pointer',
      id: 'finger1',
      parameters: { pointerType: 'touch' },
      actions: [
        { type: 'pointerMove', duration: 0, x: startX, y },
        { type: 'pointerDown', button: 0 },
        { type: 'pause', duration: 100 },
        { type: 'pointerMove', duration: 300, x: endX, y },
        { type: 'pointerUp', button: 0 }
      ]
    }]);
    // Always release actions after use
    await browser.releaseActions();

    // case: scroll scrollview sampai ketemu element
    /*const scrollView = await $(`android=new UiSelector().resourceId("abc")`);
    const targetElement = await $(`//android.widget.Gallery[@resource-id="io.appium.android.apis:id/gallery"]`);

    let maxScrolls = 5;
    let isVisible = await targetElement.isDisplayed().catch(() => false);

    while (!isVisible && maxScrolls > 0) {
      const location = await scrollView.getLocation();
      const size = await scrollView.getSize();

      const centerX = location.x + size.width / 2;
      const startY = location.y + size.height * 0.8;
      const endY = location.y + size.height * 0.2;

      // Swipe up inside the scrollView
      await browser.performActions([{
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 200 },
          { type: 'pointerMove', duration: 300, x: centerX, y: endY },
          { type: 'pointerUp', button: 0 }
        ]
      }]);
      await browser.releaseActions();

      // Wait briefly before checking again
      await browser.pause(1000);

      isVisible = await targetElement.isDisplayed().catch(() => false);
      maxScrolls--;
    }

    expect(isVisible).to.be.true;
    */

  });

  it('Scroll down', async () => {
    const viewsMenu = await $(`//android.widget.TextView[@content-desc="Views"]`);
    await viewsMenu.click();

    // scroll down
    const target = await $(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Layouts"))`);
    await target.click();

  });
});
