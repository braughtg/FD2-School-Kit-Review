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
    //crop: 'ZUCCHINI', // Not in the sample form, but needed for testing
    comment: 'A comment',
    type: 'seeding',
  };

  let results = null;
  //let cropMap = null;
  let logCategoryMap = null;
  before(() => {
    /*
     * TODO: Load any maps or other data from the API that will be needed
     *       by the tests.
     *
     *       For examples, see the before() function in lib.submit.unit.cy.js in:
     *         - modules/farm_fd2/src/entrypoints/tray_seeding
     *         - modules/farm_fd2/src/entrypoints/direct_seeding
     */
    cy.wrap(
      farmosUtil.getLogCategoryToTermMap().then((map) => {
        logCategoryMap = map;
      })
    );
    /* cy.wrap(farmosUtil.getCropNameToTermMap()).then((map) => {
      cropMap = map;
    });
*/

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
    expect(results.sampleOp.type).to.equal('log--observation');

    /*
     * Check the parts of the result that use the parameters that
     * the lib.js operation passed to the farmosUtil.createObservationLog
     * function.
     */
    expect(results.sampleOp.attributes.name).to.equal(
      form.date + '_obs_' + form.type
    );
    expect(results.sampleOp.attributes.notes.value).to.equal(form.comment);
    /*expect(results.sampleOp.relationships.plant_type[0].id).to.equal(
      cropMap.get(form.type).id
    );)*/
    expect(results.sampleOp.relationships.category[0].id).to.equal(
      logCategoryMap.get(form.type).id
    );

    //expect(results.sampleOp.relationships.parent).to.have.length(0);
  });
});
