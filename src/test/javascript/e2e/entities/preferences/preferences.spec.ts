import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PreferencesComponentsPage, PreferencesDeleteDialog, PreferencesUpdatePage } from './preferences.page-object';

const expect = chai.expect;

describe('Preferences e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let preferencesComponentsPage: PreferencesComponentsPage;
  let preferencesUpdatePage: PreferencesUpdatePage;
  let preferencesDeleteDialog: PreferencesDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Preferences', async () => {
    await navBarPage.goToEntity('preferences');
    preferencesComponentsPage = new PreferencesComponentsPage();
    await browser.wait(ec.visibilityOf(preferencesComponentsPage.title), 5000);
    expect(await preferencesComponentsPage.getTitle()).to.eq('twentyOnePointsApp.preferences.home.title');
  });

  it('should load create Preferences page', async () => {
    await preferencesComponentsPage.clickOnCreateButton();
    preferencesUpdatePage = new PreferencesUpdatePage();
    expect(await preferencesUpdatePage.getPageTitle()).to.eq('twentyOnePointsApp.preferences.home.createOrEditLabel');
    await preferencesUpdatePage.cancel();
  });

  it('should create and save Preferences', async () => {
    const nbButtonsBeforeCreate = await preferencesComponentsPage.countDeleteButtons();

    await preferencesComponentsPage.clickOnCreateButton();
    await promise.all([
      preferencesUpdatePage.setWeeklyGoalInput('5'),
      preferencesUpdatePage.weightUnitsSelectLastOption(),
      preferencesUpdatePage.userSelectLastOption()
    ]);
    expect(await preferencesUpdatePage.getWeeklyGoalInput()).to.eq('5', 'Expected weeklyGoal value to be equals to 5');
    await preferencesUpdatePage.save();
    expect(await preferencesUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await preferencesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Preferences', async () => {
    const nbButtonsBeforeDelete = await preferencesComponentsPage.countDeleteButtons();
    await preferencesComponentsPage.clickOnLastDeleteButton();

    preferencesDeleteDialog = new PreferencesDeleteDialog();
    expect(await preferencesDeleteDialog.getDialogTitle()).to.eq('twentyOnePointsApp.preferences.delete.question');
    await preferencesDeleteDialog.clickOnConfirmButton();

    expect(await preferencesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
