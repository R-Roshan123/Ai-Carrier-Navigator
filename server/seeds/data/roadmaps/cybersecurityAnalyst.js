import { resource } from './resource.js';

export default {
  role: 'cybersecurity-analyst',
  stages: [
    {
      title: 'Foundation',
      description: 'Learn the systems you will defend and the core principles of security.',
      steps: [
        {
          title: 'Networking & TCP/IP',
          description: 'Understand protocols and traffic well enough to spot what is abnormal.',
          topics: ['OSI & TCP/IP models', 'Common ports & protocols', 'Subnetting', 'Packet analysis with Wireshark'],
          skills: ['Networking'],
          resources: [
            resource('Professor Messer – Network+ videos', 'https://www.professormesser.com/', 'Video'),
            resource('Cisco Networking Academy', 'https://www.netacad.com/'),
          ],
          projects: ['Capture and annotate traffic for common protocols in Wireshark'],
          estimatedHours: 35,
          certifications: ['comptia-network', 'ccna'],
        },
        {
          title: 'Linux & Windows Fundamentals',
          description: 'Operate and investigate both major operating systems from the command line.',
          topics: ['Linux CLI & permissions', 'Windows users, services & registry', 'Event logs', 'Active Directory basics', 'PowerShell basics'],
          skills: ['Linux', 'Windows Administration'],
          resources: [
            resource('TryHackMe – Pre Security path', 'https://tryhackme.com/path/outline/presecurity', 'Practice'),
            resource('OverTheWire – Bandit', 'https://overthewire.org/wargames/bandit/', 'Practice'),
          ],
          projects: ['Build a small Windows + Linux lab in VirtualBox'],
          estimatedHours: 30,
          certifications: [],
        },
        {
          title: 'Security Fundamentals',
          description: 'Learn the CIA triad, common threats, and security controls.',
          topics: ['CIA triad', 'Threats, vulnerabilities & risk', 'Access control', 'Cryptography basics', 'Security policies'],
          skills: ['Security Fundamentals'],
          resources: [
            resource('ISC2 Certified in Cybersecurity – free training', 'https://www.isc2.org/certifications/cc'),
            resource('Google Cybersecurity Certificate', 'https://www.coursera.org/professional-certificates/google-cybersecurity', 'Course', false),
          ],
          projects: ['Write a security policy for a fictional small business'],
          estimatedHours: 30,
          certifications: ['isc2-cc', 'google-cybersecurity', 'sc-900'],
        },
      ],
    },
    {
      title: 'Intermediate',
      description: 'Automate tasks and learn the core SOC toolset.',
      steps: [
        {
          title: 'Python for Security',
          description: 'Write scripts to parse logs, query APIs, and automate investigations.',
          topics: ['Python basics', 'Regex & log parsing', 'Working with APIs', 'Hashing & encoding'],
          skills: ['Python Scripting'],
          resources: [
            resource('Automate the Boring Stuff with Python', 'https://automatetheboringstuff.com/', 'Book'),
          ],
          projects: ['Script that flags failed-login bursts in auth logs'],
          estimatedHours: 25,
          certifications: [],
        },
        {
          title: 'SIEM & Log Analysis',
          description: 'Collect, search, and correlate logs to detect threats.',
          topics: ['Log sources', 'SIEM search languages (SPL/KQL)', 'Detection rules', 'Alert triage', 'Dashboards'],
          skills: ['SIEM', 'Log Analysis'],
          resources: [
            resource('Splunk free training', 'https://www.splunk.com/en_us/training/free-courses/overview.html'),
            resource('TryHackMe – SOC Level 1', 'https://tryhackme.com/path/outline/soclevel1', 'Practice', false),
          ],
          projects: ['Build detection rules for brute force and suspicious PowerShell'],
          estimatedHours: 40,
          certifications: ['comptia-security'],
        },
      ],
    },
    {
      title: 'Advanced',
      description: 'Investigate, respond, and find weaknesses before attackers do.',
      steps: [
        {
          title: 'Threat Intelligence & MITRE ATT&CK',
          description: 'Use threat intel and the ATT&CK framework to understand adversary behaviour.',
          topics: ['Indicators of compromise', 'MITRE ATT&CK tactics & techniques', 'Threat intel feeds', 'Cyber kill chain'],
          skills: ['Threat Intelligence'],
          resources: [
            resource('MITRE ATT&CK', 'https://attack.mitre.org/', 'Docs'),
          ],
          projects: ['Map a public breach report to ATT&CK techniques'],
          estimatedHours: 20,
          certifications: [],
        },
        {
          title: 'Incident Response',
          description: 'Contain, eradicate, and recover from security incidents.',
          topics: ['IR lifecycle', 'Evidence handling', 'Memory & disk forensics basics', 'Playbooks', 'Post-incident reports'],
          skills: ['Incident Response'],
          resources: [
            resource('NIST SP 800-61 – Incident Response Recommendations', 'https://csrc.nist.gov/pubs/sp/800/61/r3/final', 'Docs'),
            resource('Blue Team Labs Online', 'https://blueteamlabs.online/', 'Practice'),
          ],
          projects: ['Write an IR playbook for a phishing incident'],
          estimatedHours: 30,
          certifications: ['comptia-cysa'],
        },
        {
          title: 'Vulnerability Assessment & Ethical Hacking',
          description: 'Find and prioritise vulnerabilities in networks and web applications.',
          topics: ['Scanning with Nmap & Nessus', 'CVSS scoring', 'OWASP Top 10', 'Web app testing with Burp Suite', 'Reporting'],
          skills: ['Vulnerability Assessment'],
          resources: [
            resource('PortSwigger Web Security Academy', 'https://portswigger.net/web-security', 'Practice'),
            resource('OWASP Top 10', 'https://owasp.org/www-project-top-ten/', 'Article'),
          ],
          projects: ['Vulnerability assessment report on a deliberately vulnerable app (e.g. OWASP Juice Shop)'],
          estimatedHours: 40,
          certifications: ['ceh'],
        },
      ],
    },
    {
      title: 'Job-Ready',
      description: 'Cover cloud and compliance, then prove your skills in a home lab.',
      steps: [
        {
          title: 'Cloud Security, Risk & Compliance',
          description: 'Apply security frameworks and secure cloud workloads.',
          topics: ['NIST Cybersecurity Framework', 'CIS Controls', 'ISO 27001 overview', 'Cloud shared responsibility', 'Cloud security posture'],
          skills: ['Cloud Security', 'Risk & Compliance'],
          resources: [
            resource('NIST Cybersecurity Framework', 'https://www.nist.gov/cyberframework', 'Docs'),
            resource('CIS Critical Security Controls', 'https://www.cisecurity.org/controls', 'Docs'),
          ],
          projects: ['Gap assessment of a sample company against CIS Controls'],
          estimatedHours: 25,
          certifications: [],
        },
        {
          title: 'SOC Home Lab & Interview Prep',
          description: 'Run a home SOC lab and prepare to walk through investigations.',
          topics: ['Lab architecture', 'Attack simulation', 'Detection & write-ups', 'Scenario-based interviews'],
          skills: [],
          resources: [
            resource('Wazuh documentation', 'https://documentation.wazuh.com/current/index.html', 'Docs'),
            resource('roadmap.sh – Cyber Security', 'https://roadmap.sh/cyber-security', 'Article'),
          ],
          projects: ['Home SOC lab with Wazuh, simulated attacks, and documented detections'],
          estimatedHours: 40,
          certifications: [],
        },
      ],
    },
  ],
};
