import { STAGES, THRESHOLDS } from './config.js';
import { createEmployee, announcementCreation, awardCreation } from './lib.js';

export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: STAGES.stress,
    },
  },
  thresholds: THRESHOLDS,
};

export default function () {
  createEmployee();
  announcementCreation();
  awardCreation();
}