import { Page } from '@playwright/test';
import { expect, test } from '../fixtures/baseFixtures';
import LeftBarPage from '../model/menu/leftBar.pageModel';
import ReportPage from '../model/report.pageModel';
import ReportDetailsPage from '../model/reportDetails.pageModel';
import StixDomainObjectContentTabPage from '../model/StixDomainObjectContentTab.pageModel';
import ContainerObservablesPage from '../model/containerObservables.pageModel';
import StixCoreObjectDataTab from '../model/StixCoreObjectDataTab.pageModel';

/**
 * Goal: validate that everything is opening without errors
 * Content of the test
 * -------------------
 * Go on report
 * view list of report
 * open one report in overview
 * navigate to knowledge
 * navigate to content
 * navigate to entities
 * navigate to observables
 * navigate to data
 * @param page
 */
const navigateReports = async (page: Page) => {
  const reportNameFromInitData = 'E2E dashboard - Report - now';

  const reportPage = new ReportPage(page);
  await reportPage.goto();
  await expect(reportPage.getPage()).toBeVisible();
  await expect(page.getByText(reportNameFromInitData)).toBeVisible();
  await reportPage.getItemFromList(reportNameFromInitData).click();

  const reportDetailsPage = new ReportDetailsPage(page);
  await expect(reportDetailsPage.getPage()).toBeVisible();

  // -- Knowledge
  await reportDetailsPage.goToKnowledgeTab();
  await expect(page.getByTestId('report-knowledge')).toBeVisible();
  await page.getByLabel('TimeLine view').click();
  await page.getByLabel('Correlation view').click();
  await page.getByLabel('Tactics matrix view').click();
  await page.getByLabel('Graph view').click();

  // -- Content
  await reportDetailsPage.goToContentTab();
  const contentTab = new StixDomainObjectContentTabPage(page);
  await expect(contentTab.getPage()).toBeVisible();
  await contentTab.getContentMappingViewButton().click();
  await expect(page.getByRole('button', { name: 'Clear mappings' })).toBeVisible();
  await contentTab.getContentViewButton().click();
  await expect(page.getByText('Description', { exact: true })).toBeVisible();
  await expect(page.getByText('Mappable content')).toBeVisible();

  // -- Entities
  await reportDetailsPage.goToEntitiesTab();
  await expect(page.getByText('Entity types')).toBeVisible();
  await expect(page.getByText('Add entity')).toBeVisible();

  // -- Artifact / Observables
  await reportDetailsPage.goToObservablesTab();
  const observablesTab = new ContainerObservablesPage(page);
  await expect(observablesTab.getPage()).toBeVisible();

  // -- Data
  await reportDetailsPage.goToDataTab();
  const dataTab = new StixCoreObjectDataTab(page);
  await expect(dataTab.getPage()).toBeVisible();
};

const navigateAllMenu = async (page: Page) => {
  await page.goto('/');
  const leftBarPage = new LeftBarPage(page);
  await leftBarPage.open();

  // Checking Analyses menu
  await leftBarPage.clickOnMenu('Analyses', 'Reports');
  await leftBarPage.expectBreadcrumb('Analyses', 'Reports');
  await leftBarPage.clickOnMenu('Analyses', 'Groupings');
  await leftBarPage.expectBreadcrumb('Analyses', 'Groupings');
  await leftBarPage.clickOnMenu('Analyses', 'Malware analyses');
  await leftBarPage.expectBreadcrumb('Analyses', 'Malware analyses');
  await leftBarPage.clickOnMenu('Analyses', 'Notes');
  await leftBarPage.expectBreadcrumb('Analyses', 'Notes');
  await leftBarPage.clickOnMenu('Analyses', 'External references');
  await leftBarPage.expectBreadcrumb('Analyses', 'External references');

  // Checking Cases menu
  await leftBarPage.clickOnMenu('Cases', 'Incident responses');
  await leftBarPage.expectBreadcrumb('Cases', 'Incident responses');
  await leftBarPage.clickOnMenu('Cases', 'Requests for information');
  await leftBarPage.expectBreadcrumb('Cases', 'Requests for information');
  await leftBarPage.clickOnMenu('Cases', 'Requests for takedown');
  await leftBarPage.expectBreadcrumb('Cases', 'Requests for takedown');
  await leftBarPage.clickOnMenu('Cases', 'Tasks');
  await leftBarPage.expectBreadcrumb('Cases', 'Tasks');
  await leftBarPage.clickOnMenu('Cases', 'Requests for takedown');
  await leftBarPage.expectBreadcrumb('Cases', 'Requests for takedown');

  // Checking Events menu
  await leftBarPage.clickOnMenu('Events', 'Incidents');
  await leftBarPage.expectBreadcrumb('Events', 'Incidents');
  await leftBarPage.clickOnMenu('Events', 'Sightings');
  await leftBarPage.expectBreadcrumb('Events', 'Sightings');
  await leftBarPage.clickOnMenu('Events', 'Observed data');
  await leftBarPage.expectBreadcrumb('Events', 'Observed data');

  // Checking Observations menu
  await leftBarPage.clickOnMenu('Observations', 'Observables');
  await leftBarPage.expectBreadcrumb('Observations', 'Observables');
  await leftBarPage.clickOnMenu('Observations', 'Artifacts');
  await leftBarPage.expectBreadcrumb('Observations', 'Artifacts');
  await leftBarPage.clickOnMenu('Observations', 'Indicators');
  await leftBarPage.expectBreadcrumb('Observations', 'Indicators');
  await leftBarPage.clickOnMenu('Observations', 'Infrastructures');
  await leftBarPage.expectBreadcrumb('Observations', 'Infrastructures');

  // Checking Threats menu
  await leftBarPage.clickOnMenu('Threats', 'Threat actors (group)');
  await leftBarPage.expectBreadcrumb('Threats', 'Threat actors (group)');
  await leftBarPage.clickOnMenu('Threats', 'Threat actors (individual)');
  await leftBarPage.expectBreadcrumb('Threats', 'Threat actors (individual)');
  await leftBarPage.clickOnMenu('Threats', 'Intrusion sets');
  await leftBarPage.expectBreadcrumb('Threats', 'Intrusion sets');
  await leftBarPage.clickOnMenu('Threats', 'Campaigns');
  await leftBarPage.expectBreadcrumb('Threats', 'Campaigns');

  // Checking Arsenal menu
  await leftBarPage.clickOnMenu('Arsenal', 'Malware');
  await leftBarPage.expectBreadcrumb('Arsenal', 'Malware');
  await leftBarPage.clickOnMenu('Arsenal', 'Channels');
  await leftBarPage.expectBreadcrumb('Arsenal', 'Channels');
  await leftBarPage.clickOnMenu('Arsenal', 'Tools');
  await leftBarPage.expectBreadcrumb('Arsenal', 'Tools');
  await leftBarPage.clickOnMenu('Arsenal', 'Vulnerabilities');
  await leftBarPage.expectBreadcrumb('Arsenal', 'Vulnerabilities');

  // Checking Techniques menu
  await leftBarPage.clickOnMenu('Techniques', 'Attack patterns');
  await leftBarPage.expectBreadcrumb('Techniques', 'Attack patterns');
  await leftBarPage.clickOnMenu('Techniques', 'Narratives');
  await leftBarPage.expectBreadcrumb('Techniques', 'Narratives');
  await leftBarPage.clickOnMenu('Techniques', 'Courses of action');
  await leftBarPage.expectBreadcrumb('Techniques', 'Courses of action');
  await leftBarPage.clickOnMenu('Techniques', 'Data components');
  await leftBarPage.expectBreadcrumb('Techniques', 'Data components');
  await leftBarPage.clickOnMenu('Techniques', 'Data sources');
  await leftBarPage.expectBreadcrumb('Techniques', 'Data sources');

  // Checking Entities menu
  await leftBarPage.clickOnMenu('Entities', 'Sectors');
  await leftBarPage.expectBreadcrumb('Entities', 'Sectors');
  // await leftBarPage.expectBreadcrumb('Entities', 'Events'); <-- COMPLEX FOR NOW BECAUSE WE HAVE TWO MENUS WITH THE SAME NAME
  await leftBarPage.clickOnMenu('Entities', 'Organizations');
  await leftBarPage.expectBreadcrumb('Entities', 'Organizations');
  await leftBarPage.clickOnMenu('Entities', 'Systems');
  await leftBarPage.expectBreadcrumb('Entities', 'Systems');
  await leftBarPage.clickOnMenu('Entities', 'Individuals');
  await leftBarPage.expectBreadcrumb('Entities', 'Individuals');

  // Checking Locations menu
  await leftBarPage.clickOnMenu('Locations', 'Regions');
  await leftBarPage.expectBreadcrumb('Locations', 'Regions');
  await leftBarPage.clickOnMenu('Locations', 'Countries');
  await leftBarPage.expectBreadcrumb('Locations', 'Countries');
  await leftBarPage.clickOnMenu('Locations', 'Administrative areas');
  await leftBarPage.expectBreadcrumb('Locations', 'Administrative areas');
  await leftBarPage.clickOnMenu('Locations', 'Cities');
  await leftBarPage.expectBreadcrumb('Locations', 'Cities');
  await leftBarPage.clickOnMenu('Locations', 'Positions');
  await leftBarPage.expectBreadcrumb('Locations', 'Positions');

  // Checking Dashboards menu
  await leftBarPage.clickOnMenu('Dashboards', 'Custom dashboards');
  await leftBarPage.expectBreadcrumb('Dashboards', 'Custom dashboards');
  await leftBarPage.clickOnMenu('Dashboards', 'Public dashboards');
  await leftBarPage.expectBreadcrumb('Dashboards', 'Public dashboards');

  // Checking Data menu
  // await leftBarPage.expectBreadcrumb('Data', 'Entities'); <-- COMPLEX FOR NOW BECAUSE WE HAVE TWO MENUS WITH THE SAME NAME
  await leftBarPage.clickOnMenu('Data', 'Relationships');
  await leftBarPage.expectBreadcrumb('Data', 'Relationships');
  await leftBarPage.clickOnMenu('Data', 'Ingestion');
  await leftBarPage.expectBreadcrumb('Data', 'Ingestion');
  await leftBarPage.clickOnMenu('Data', 'Import');
  await leftBarPage.expectBreadcrumb('Data', 'Import');
  await leftBarPage.clickOnMenu('Data', 'Processing');
  await leftBarPage.expectBreadcrumb('Data', 'Processing');
  await leftBarPage.clickOnMenu('Data', 'Data sharing');
  await leftBarPage.expectBreadcrumb('Data', 'Data sharing');

  // Checking Settings menu
  await leftBarPage.clickOnMenu('Settings', 'Parameters');
  await leftBarPage.expectBreadcrumb('Settings', 'Parameters');
  await leftBarPage.clickOnMenu('Settings', 'Security');
  await leftBarPage.expectBreadcrumb('Settings', 'Security');
  await leftBarPage.clickOnMenu('Settings', 'Customization');
  await leftBarPage.expectBreadcrumb('Settings', 'Customization');
  await leftBarPage.clickOnMenu('Settings', 'Taxonomies');
  await leftBarPage.expectBreadcrumb('Settings', 'Taxonomies');
  await leftBarPage.clickOnMenu('Settings', 'File indexing');
  await leftBarPage.expectBreadcrumb('Settings', 'File indexing');
  await leftBarPage.clickOnMenu('Settings', 'Support');
  await leftBarPage.expectBreadcrumb('Settings', 'Support');

  // Other
  await leftBarPage.clickOnMenu('Investigations');
  await expect(page.getByRole('paragraph')).toHaveText('Investigations');
};

test('Check navigation on all pages', { tag: ['@navigation'] }, async ({ page }) => {
  await navigateAllMenu(page);
  await navigateReports(page);
});
