import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL, EMPLOYEE_TOKEN, ANNOUNCEMENT_TOKEN, commonHeaders } from './config.js';

/**
 * Generates a random integer between min and max (inclusive).
 * 
 * @param {number} min - The minimum value (inclusive)
 * @param {number} max - The maximum value (inclusive)
 * @returns {number} A random integer between min and max
 * 
 * @example
 * const num = randomInt(1, 100); // Returns random number from 1 to 100
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Creates a new employee via the YoSuite employee onboarding API.
 * 
 * Sends a POST request to the employee onboarding endpoint with randomized
 * employee data including name, email, phone, address, and employment details.
 * Validates the response status and success message.
 * 
 * @returns {import('k6/http').Response} The HTTP response object from the API call
 * 
 * @description
 * Generated employee data:
 * - first_name: FN_{random 100-999}
 * - last_name: LN_{random 100-999}
 * - middle_name: MN_{random 100-999}
 * - email: user{timestamp}@test.com
 * - phone: 8801{random 30000000-99999999}
 * - staff_id: {random 100000-999999}
 * - date_of_birth: Random date between 1990-2002
 * - hire_date/joining_date: Current date
 * 
 * Endpoint: POST /component/modules/people/employee/e-onboarding-steps/form-component/store-content
 * Auth: Bearer EMPLOYEE_TOKEN
 * Content-Type: multipart/form-data
 * Success Message: "Employee Added Successfully!"
 * 
 * @example
 * export default function () {
 *   createEmployee();
 * }
 */
export function createEmployee() {
  const firstName = `FN_${randomInt(100, 999)}`;
  const lastName = `LN_${randomInt(100, 999)}`;
  const middleName = `MN_${randomInt(100, 999)}`;
  const email = `user${Date.now()}@test.com`;
  const phone = `8801${randomInt(30000000, 99999999)}`;
  const staffId = `${randomInt(100000, 999999)}`;
  const today = new Date().toISOString().split('T')[0];
  const year = randomInt(1990, 2002);
  const month = String(randomInt(1, 12)).padStart(2, '0');
  const day = String(randomInt(1, 28)).padStart(2, '0');
  const dob = `${year}-${month}-${day}`;

  const address = {
    street_1: `Street_${randomInt(1, 100)}`,
    street_2: null,
    country: 'Anguilla',
    state: 'East End',
    city: `City_${randomInt(1, 50)}`,
    zip: `ZIP_${randomInt(1000, 9999)}`,
  };

  const requestBody = {
    first_name: firstName,
    middle_name: middleName,
    last_name: lastName,
    email: email,
    phone: phone,
    staff_id: staffId,
    address_group: {
      present_address: address,
      permanent_address: {
        same_as_present_address: true,
        ...address,
      },
    },
    employee_department_option_id: '69391644740acf1e0c0373e7',
    employee_job_location_option_id: '695dde14f97ee294810d9823',
    employee_status_option_id: '692fdff8397c6c094bfb44a5',
    employee_gender_option_id: '692fdffb397c6c094bfb44cd',
    employee_job_type_option_id: '692fdff8397c6c094bfb44ab',
    employee_job_title_option_id: '695dd83f49eaf632130950b3',
    manager_id: '69ad216652b0b8a3d20a9eb2',
    who_to_contact_id: '69ad214f52b0b8a3d20a9ea6',
    shift_option_id: '692fe275f348e6963301e216',
    social_security_no: `SSN_${randomInt(10000, 99999)}`,
    work_function: 'remote',
    date_of_birth: dob,
    hire_date: today,
    joining_date: today,
    employer_tasks: null,
    joiner_tasks: null,
    joiner_questions: {
      '695ddd1ce35026b82201d8b3': { '0': true, '1': true },
      '697b3ceef1f074b159047766': { '0': true },
    },
  };

  const url = `${BASE_URL}/component/modules/people/employee/e-onboarding-steps/form-component/store-content`;
  const headers = {
    ...commonHeaders,
    'authorization': `Bearer ${EMPLOYEE_TOKEN}`,
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryPV3qcBQTUG7Bdw6X',
  };

  const formData = `------WebKitFormBoundaryPV3qcBQTUG7Bdw6X\r
Content-Disposition: form-data; name="data"\r
\r
${JSON.stringify(requestBody)}\r
------WebKitFormBoundaryPV3qcBQTUG7Bdw6X--`;

  const res = http.post(url, formData, { headers });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'success message correct': (r) => {
      try {
        const json = r.json();
        return json.message && json.message.success && json.message.success[0] === 'Employee Added Successfully!';
      } catch (e) {
        return false;
      }
    },
  });

  sleep(1);
  return res;
}

/**
 * Creates a new announcement via the YoSuite announcements API.
 * 
 * Sends a POST request to the announcements endpoint with randomized
 * announcement data including title, content, and random boolean flags
 * for pinned status and comment settings.
 * 
 * @returns {import('k6/http').Response} The HTTP response object from the API call
 * 
 * @description
 * Generated announcement data:
 * - title: test_{random 0-10000}
 * - content: HTML paragraph with random text content
 * - pinned: Random boolean (50% chance)
 * - enable_comments: Random boolean (50% chance)
 * - applicable_scope: "all"
 * - category: "general"
 * 
 * Endpoint: POST /component/modules/announcements/announcement/form/form-component/store-content
 * Auth: Bearer ANNOUNCEMENT_TOKEN
 * Content-Type: multipart/form-data
 * Success Message: "Data Inserted Successfully"
 * 
 * @example
 * export default function () {
 *   announcementCreation();
 * }
 */
export function announcementCreation() {
  const title = `test_${Math.floor(Math.random() * 10000)}`;
  const randomText = `content_${Date.now()}`;
  const pinned = Math.random() > 0.5;
  const enable_comments = Math.random() > 0.5;

  const content = `<p class="PlaygroundEditorTheme__paragraph" dir="ltr">
<span style="white-space: pre-wrap;">${randomText}</span>
</p>`;

  const requestBody = {
    title: title,
    attachments: null,
    applicable_scope: 'all',
    exclude_with: null,
    is_event: false,
    pinned: pinned,
    enable_comments: enable_comments,
    color: null,
    category: 'general',
    content: content,
  };

  const url = `${BASE_URL}/component/modules/announcements/announcement/form/form-component/store-content`;
  const headers = {
    ...commonHeaders,
    'authorization': `Bearer ${ANNOUNCEMENT_TOKEN}`,
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarygZCoqjVWKOJfAikA',
  };

  const formData = `------WebKitFormBoundarygZCoqjVWKOJfAikA\r
Content-Disposition: form-data; name="data"\r
\r
${JSON.stringify(requestBody)}\r
------WebKitFormBoundarygZCoqjVWKOJfAikA--`;

  const res = http.post(url, formData, { headers });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'success message correct': (r) => {
      try {
        const json = r.json();
        return json.message && json.message.success && json.message.success[0] === 'Data Inserted Successfully';
      } catch (e) {
        return false;
      }
    },
  });

  sleep(1);
  return res;
}

/**
 * Creates a new award via the YoSuite appreciations/awards API.
 * 
 * Sends a POST request to the awards endpoint with randomized
 * award data including name, note, and award item details with
 * random gift names and prices in USD.
 * 
 * @returns {import('k6/http').Response} The HTTP response object from the API call
 * 
 * @description
 * Generated award data:
 * - name: test_{random 0-10000}
 * - note: note_{timestamp}
 * - award_item:
 *   - temp: Award_{random 0-100}
 *   - gift_name: gift_{random 0-1000}
 *   - price: Random $50-$549
 *   - currency: "USD"
 * 
 * Endpoint: POST /component/modules/appreciations/award/form/form-component/store-content
 * Auth: Bearer ANNOUNCEMENT_TOKEN
 * Content-Type: multipart/form-data
 * Success Message: "Data Inserted Successfully"
 * 
 * @example
 * export default function () {
 *   awardCreation();
 * }
 */
export function awardCreation() {
  const name = `test_${Math.floor(Math.random() * 10000)}`;
  const note = `note_${Date.now()}`;

  const award_item = [
    {
      temp: `Award_${Math.floor(Math.random() * 100)}`,
      currency: 'USD',
      gift_name: `gift_${Math.floor(Math.random() * 1000)}`,
      price: Math.floor(Math.random() * 500) + 50,
    },
  ];

  const requestBody = {
    name: name,
    note: note,
    award_item: award_item,
  };

  const url = `${BASE_URL}/component/modules/appreciations/award/form/form-component/store-content`;
  const headers = {
    ...commonHeaders,
    'authorization': `Bearer ${ANNOUNCEMENT_TOKEN}`,
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarylyclx7dwBjgshsxo',
  };

  const formData = `------WebKitFormBoundarylyclx7dwBjgshsxo\r
Content-Disposition: form-data; name="data"\r
\r
${JSON.stringify(requestBody)}\r
------WebKitFormBoundarylyclx7dwBjgshsxo--`;

  const res = http.post(url, formData, { headers });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'success message correct': (r) => {
      try {
        const json = r.json();
        return json.message && json.message.success && json.message.success[0] === 'Data Inserted Successfully';
      } catch (e) {
        return false;
      }
    },
  });

  sleep(1);
  return res;
}
