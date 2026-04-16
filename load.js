import { STAGES, THRESHOLDS } from './config.js';
import { createEmployee, announcementCreation, awardCreation } from './lib.js';

export const options = {
  scenarios: {
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: STAGES.load,
    },
  },
  thresholds: THRESHOLDS,
};

export default function () {
  createEmployee();
  announcementCreation();
  awardCreation();
}