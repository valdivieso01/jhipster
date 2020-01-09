import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BloodPressureComponentsPage, BloodPressureDeleteDialog, BloodPressureUpdatePage } from './blood-pressure.page-object';

const expect = chai.expect;

describe('BloodPressure e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bloodPressureComponentsPage: BloodPressureComponentsPage;
  let bloodPressureUpdatePage: BloodPressureUpdatePage;
  let bloodPressureDeleteDialog: BloodPressureDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load BloodPressures', async () => {
    await navBarPage.goToEntity('blood-pressure');
    bloodPressureComponentsPage = new BloodPressureComponentsPage();
    await browser.wait(ec.visibilityOf(bloodPressureComponentsPage.title), 5000);
    expect(await bloodPressureComponentsPage.getTitle()).to.eq('twentyOnePointsApp.bloodPressure.home.title');
  });

  it('should load create BloodPressure page', async () => {
    await bloodPressureComponentsPage.clickOnCreateButton();
    bloodPressureUpdatePage = new BloodPressureUpdatePage();
    expect(await bloodPressureUpdatePage.getPageTitle()).to.eq('twentyOnePointsApp.bloodPressure.home.createOrEditLabel');
    await bloodPressureUpdatePage.cancel();
  });

  it('should create and save BloodPressures', async () => {
    const nbButtonsBeforeCreate = await bloodPressureComponentsPage.countDeleteButtons();

    await bloodPressureComponentsPage.clickOnCreateButton();
    await promise.all([
      bloodPressureUpdatePage.setDateInput('2000-12-31'),
      bloodPressureUpdatePage.setSystolicInput('systolic'),
      bloodPressureUpdatePage.setDiastolicInput('diastolic'),
      bloodPressureUpdatePage.userSelectLastOption()
    ]);
    expect(await bloodPressureUpdatePage.getDateInput()).to.eq('2000-12-31', 'Expected date value to be equals to 2000-12-31');
    expect(await bloodPressureUpdatePage.getSystolicInput()).to.eq('systolic', 'Expected Systolic value to be equals to systolic');
    expect(await bloodPressureUpdatePage.getDiastolicInput()).to.eq('diastolic', 'Expected Diastolic value to be equals to diastolic');
    await bloodPressureUpdatePage.save();
    expect(await bloodPressureUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await bloodPressureComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last BloodPressure', async () => {
    const nbButtonsBeforeDelete = await bloodPressureComponentsPage.countDeleteButtons();
    await bloodPressureComponentsPage.clickOnLastDeleteButton();

    bloodPressureDeleteDialog = new BloodPressureDeleteDialog();
    expect(await bloodPressureDeleteDialog.getDialogTitle()).to.eq('twentyOnePointsApp.bloodPressure.delete.question');
    await bloodPressureDeleteDialog.clickOnConfirmButton();

    expect(await bloodPressureComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
