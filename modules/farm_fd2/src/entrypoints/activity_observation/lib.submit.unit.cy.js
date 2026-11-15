import { lib } from './lib';

describe('Test the Activity Observation lib submission', () => {
  let form = {
    date: '1950-01-02',
    type: 'seeding',
    comment: 'A comment',
  };

  let results = null;
  let logCategoryMap = null;
  before(() => {
    cy.wrap(farmosUtil.getLogCategoryToTermMap()).then((map) => {
      logCategoryMap = map;
    });

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

  it('creates an observation log with the submitted form data', () => {
    expect(results.sampleOp.type).to.equal('log--observation');
    expect(results.sampleOp.attributes.name).to.equal(
      form.date + '_obs_' + form.type
    );
    expect(results.sampleOp.attributes.notes.value).to.equal(form.comment);
    expect(results.sampleOp.relationships.category[0].id).to.equal(
      logCategoryMap.get(form.type).id
    );
  });
});
