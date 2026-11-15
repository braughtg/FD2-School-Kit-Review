import { lib } from './lib';

describe('Test the Activity Observation lib submission', () => {
  /*
   * TODO: Create a form object that has the same format as the
   *       data.form object used in the entry point.
   *
   *       This is passed to the submitForm function as if it is
   *       coming from the entry point when the "Submit" button is clicked.
   */
  let form = {
    date: '1950-01-02',
    logCategory: 'seeding',
    // the submit function was changed to be for Activity Observation, so the logCategory is now required
    // Not in the sample form, but needed for testing
    comment: 'A comment',
  };

  let results = null;
  let categoryMap = null;
  before(() => {
    /*
     * TODO: Load any maps or other data from the API that will be needed
     *       by the tests.
     *
     *       For examples, see the before() function in lib.submit.unit.cy.js in:
     *         - modules/farm_fd2/src/entrypoints/tray_seeding
     *         - modules/farm_fd2/src/entrypoints/direct_seeding
     */
    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
      categoryMap = map;
    });

  before(() => {
    /*
     * Submit the form using lib.submitForm from farmosUtil to create
     * all the logs, assets and quantities needed to represent a
     * Activity Observation.
     */
    cy.wrap(lib.submitForm(form), { timeout: 10000 }).then((submitted) => {
      results = submitted;
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.restoreSessionStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
    cy.saveSessionStorage();
  });

  it('Activity Observation: checks the result', () => {
    /*
     * Check to be sure we get a plant asset.  This confirms that the lib.js
     * operation created the correct type of farmOS record.
     */
    expect(results.observationLog.type).to.equal('log--observation');

    /*
     * Check the parts of the result that use the parameters that
     * the lib.js operation passed to the farmosUtil.createObservationLog
     * function.
     */
    expect(results.observationLog.attributes.timestamp).to.contain(form.date);
    expect(results.observationLog.attributes.notes.value).to.equal(
      form.comment
    );
    expect(results.observationLog.relationships.category[0].id).to.equal(
      categoryMap.get(form.logCategory).id
    );
  });
});
