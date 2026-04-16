import { STAGES, THRESHOLDS } from './config.js';
import { createEmployee, announcementCreation, awardCreation } from './lib.js';

export const options = {
  scenarios: {
    soak: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: STAGES.soak,
    },
  },
  thresholds: THRESHOLDS,
};

export default function () {
  createEmployee();
  announcementCreation();
  awardCreation();
}