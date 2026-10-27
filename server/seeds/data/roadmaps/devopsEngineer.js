import { resource } from './resource.js';

export default {
  role: 'devops-engineer',
  stages: [
    {
      title: 'Foundation',
      description: 'Get comfortable with Linux, networks, version control, and scripting.',
      steps: [
        {
          title: 'Linux Administration',
          description: 'Administer Linux systems: users, services, storage, and troubleshooting.',
          topics: ['Filesystem & permissions', 'systemd services', 'Users & groups', 'Disk & storage', 'Log analysis'],
          skills: ['Linux'],
          resources: [
            resource('Linux Journey', 'https://linuxjourney.com/'),
            resource('OverTheWire – Bandit', 'https://overthewire.org/wargames/bandit/', 'Practice'),
          ],
          projects: ['Provision and harden a Linux server running Nginx'],
          estimatedHours: 35,
          certifications: ['lfcs'],
        },
        {
          title: 'Networking for DevOps',
          description: 'Understand the networking concepts behind deployments and outages.',
          topics: ['TCP/IP & ports', 'DNS', 'HTTP/HTTPS & TLS', 'Reverse proxies & load balancing', 'Firewalls'],
          skills: ['Networking'],
          resources: [
            resource('Cloudflare Learning Center', 'https://www.cloudflare.com/learning/', 'Article'),
          ],
          projects: ['Put an app behind an Nginx reverse proxy with TLS'],
          estimatedHours: 20,
          certifications: [],
        },
        {
          title: 'Git Workflows',
          description: 'Use Git branching strategies that support continuous delivery.',
          topics: ['Branching strategies', 'Trunk-based development', 'Pull requests', 'Tags & releases'],
          skills: ['Git'],
          resources: [
            resource('Pro Git (free book)', 'https://git-scm.com/book/en/v2', 'Book'),
          ],
          projects: [],
          estimatedHours: 10,
          certifications: [],
        },
        {
          title: 'Scripting: Bash & Python',
          description: 'Automate operational tasks and glue tools together.',
          topics: ['Bash scripting', 'Python for automation', 'Working with JSON & APIs', 'Error handling in scripts'],
          skills: ['Scripting'],
          resources: [
            resource('GNU Bash manual', 'https://www.gnu.org/software/bash/manual/', 'Docs'),
            resource('Automate the Boring Stuff with Python', 'https://automatetheboringstuff.com/', 'Book'),
          ],
          projects: ['Health-check script that posts alerts to a chat webhook'],
          estimatedHours: 30,
          certifications: [],
        },
      ],
    },
    {
      title: 'Intermediate',
      description: 'Automate delivery and package applications consistently.',
      steps: [
        {
          title: 'CI/CD Pipelines',
          description: 'Automate build, test, and deployment on every change.',
          topics: ['Pipeline stages', 'GitHub Actions workflows', 'Jenkins basics', 'Artifacts & caching', 'Deployment strategies (blue-green, canary)'],
          skills: ['CI/CD'],
          resources: [
            resource('GitHub Actions documentation', 'https://docs.github.com/en/actions', 'Docs'),
            resource('Jenkins User Documentation', 'https://www.jenkins.io/doc/', 'Docs'),
          ],
          projects: ['CI pipeline that lints, tests, and builds a web app on every PR'],
          estimatedHours: 30,
          certifications: ['github-actions'],
        },
        {
          title: 'Docker',
          description: 'Containerise applications and manage multi-container setups.',
          topics: ['Images & layers', 'Dockerfile best practices', 'Volumes & networks', 'Docker Compose', 'Registries'],
          skills: ['Docker'],
          resources: [
            resource('Docker – Get started', 'https://docs.docker.com/get-started/', 'Docs'),
          ],
          projects: ['Compose stack with app, database, and cache'],
          estimatedHours: 25,
          certifications: [],
        },
        {
          title: 'Cloud Platform Basics',
          description: 'Learn the core services of a major cloud provider.',
          topics: ['Compute, storage & databases', 'VPC networking', 'IAM', 'Managed container services'],
          skills: ['Cloud Platforms'],
          resources: [
            resource('AWS Skill Builder', 'https://skillbuilder.aws/'),
          ],
          projects: ['Deploy your Docker app to AWS ECS or App Runner'],
          estimatedHours: 40,
          certifications: ['aws-ccp'],
        },
      ],
    },
    {
      title: 'Advanced',
      description: 'Orchestrate at scale, codify infrastructure, and observe everything.',
      steps: [
        {
          title: 'Kubernetes',
          description: 'Run and operate containerised workloads on Kubernetes.',
          topics: ['Pods, Deployments & Services', 'ConfigMaps & Secrets', 'Ingress', 'Helm', 'Autoscaling', 'Troubleshooting'],
          skills: ['Kubernetes'],
          resources: [
            resource('Kubernetes documentation – Tutorials', 'https://kubernetes.io/docs/tutorials/', 'Docs'),
            resource('Killercoda – Kubernetes playgrounds', 'https://killercoda.com/', 'Practice'),
          ],
          projects: ['Deploy a microservice app to Kubernetes with Helm'],
          estimatedHours: 60,
          certifications: ['cka', 'ckad'],
        },
        {
          title: 'Terraform & Ansible',
          description: 'Provision infrastructure and configure servers declaratively.',
          topics: ['Terraform providers, state & modules', 'Ansible inventories & playbooks', 'Roles', 'Idempotency'],
          skills: ['Infrastructure as Code', 'Configuration Management'],
          resources: [
            resource('HashiCorp Terraform tutorials', 'https://developer.hashicorp.com/terraform/tutorials'),
            resource('Ansible – Getting started', 'https://docs.ansible.com/ansible/latest/getting_started/index.html', 'Docs'),
          ],
          projects: ['Terraform + Ansible setup for a staging environment'],
          estimatedHours: 40,
          certifications: ['terraform-associate'],
        },
        {
          title: 'Observability: Prometheus & Grafana',
          description: 'Collect metrics and logs, build dashboards, and alert on what matters.',
          topics: ['Metrics vs logs vs traces', 'Prometheus & PromQL', 'Grafana dashboards', 'Alerting', 'SLIs & SLOs'],
          skills: ['Monitoring & Logging'],
          resources: [
            resource('Prometheus – Overview', 'https://prometheus.io/docs/introduction/overview/', 'Docs'),
            resource('Grafana tutorials', 'https://grafana.com/tutorials/', 'Docs'),
          ],
          projects: ['Monitoring stack with dashboards and alerts for your Kubernetes app'],
          estimatedHours: 25,
          certifications: [],
        },
      ],
    },
    {
      title: 'Job-Ready',
      description: 'Secure the pipeline and bring it all together.',
      steps: [
        {
          title: 'DevSecOps',
          description: 'Shift security left with automated scanning and secret management.',
          topics: ['SAST & dependency scanning', 'Container image scanning', 'Secrets management', 'Policy as code'],
          skills: ['DevSecOps'],
          resources: [
            resource('OWASP DevSecOps Guideline', 'https://owasp.org/www-project-devsecops-guideline/', 'Article'),
            resource('Trivy documentation', 'https://trivy.dev/', 'Docs'),
          ],
          projects: ['Add image and dependency scanning gates to your pipeline'],
          estimatedHours: 20,
          certifications: [],
        },
        {
          title: 'Capstone Pipeline & Interview Prep',
          description: 'Build a complete delivery platform and prepare for scenario interviews.',
          topics: ['End-to-end pipeline design', 'Incident scenarios', 'Troubleshooting interviews'],
          skills: [],
          resources: [
            resource('roadmap.sh – DevOps', 'https://roadmap.sh/devops', 'Article'),
          ],
          projects: ['Git push → CI → image scan → deploy to Kubernetes via Terraform-managed cloud, with monitoring'],
          estimatedHours: 40,
          certifications: ['aws-saa', 'aws-devops-pro', 'az-400'],
        },
      ],
    },
  ],
};
