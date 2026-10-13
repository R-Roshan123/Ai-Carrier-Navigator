import { resource } from './resource.js';

export default {
  role: 'cloud-engineer',
  stages: [
    {
      title: 'Foundation',
      description: 'Learn the operating system, networking, and scripting skills cloud work is built on.',
      steps: [
        {
          title: 'Linux & the Command Line',
          description: 'Navigate, manage, and troubleshoot Linux servers from the terminal.',
          topics: ['Filesystem & permissions', 'Processes & services (systemd)', 'Package management', 'SSH', 'Logs & troubleshooting'],
          skills: ['Linux'],
          resources: [
            resource('Linux Journey', 'https://linuxjourney.com/'),
            resource('The Linux Command Line (free book)', 'https://linuxcommand.org/tlcl.php', 'Book'),
          ],
          projects: ['Set up and harden a Linux VM with a web server'],
          estimatedHours: 30,
          certifications: [],
        },
        {
          title: 'Networking Fundamentals',
          description: 'Understand how traffic flows between users, services, and networks.',
          topics: ['OSI & TCP/IP models', 'IP addressing & subnetting', 'DNS & HTTP(S)', 'Routing, NAT & firewalls', 'Load balancers'],
          skills: ['Networking'],
          resources: [
            resource('Cloudflare Learning Center', 'https://www.cloudflare.com/learning/', 'Article'),
            resource('Professor Messer – Network+ videos', 'https://www.professormesser.com/', 'Video'),
          ],
          projects: ['Design a subnet plan for a three-tier application'],
          estimatedHours: 30,
          certifications: ['comptia-network', 'ccna'],
        },
        {
          title: 'Scripting with Bash & Python',
          description: 'Automate repetitive operational tasks with scripts.',
          topics: ['Bash scripting', 'Python basics', 'Working with files & APIs', 'Scheduling with cron'],
          skills: ['Scripting'],
          resources: [
            resource('GNU Bash manual', 'https://www.gnu.org/software/bash/manual/', 'Docs'),
            resource('Automate the Boring Stuff with Python', 'https://automatetheboringstuff.com/', 'Book'),
          ],
          projects: ['Backup script that uploads logs to cloud storage'],
          estimatedHours: 25,
          certifications: [],
        },
      ],
    },
    {
      title: 'Intermediate',
      description: 'Learn core cloud services on one provider, then broaden to a second.',
      steps: [
        {
          title: 'Cloud Concepts & AWS Core Services',
          description: 'Learn compute, storage, databases, and networking on AWS.',
          topics: ['Shared responsibility model', 'EC2, S3, RDS', 'VPC basics', 'Pricing models', 'Regions & availability zones'],
          skills: ['Cloud Fundamentals', 'AWS'],
          resources: [
            resource('AWS Skill Builder', 'https://skillbuilder.aws/'),
            resource('AWS Documentation', 'https://docs.aws.amazon.com/', 'Docs'),
          ],
          projects: ['Host a static site on S3 + CloudFront', 'Launch an EC2 web server in a custom VPC'],
          estimatedHours: 50,
          certifications: ['aws-ccp', 'oci-foundations', 'nptel-cloud'],
        },
        {
          title: 'Identity, Access & Cloud Security',
          description: 'Control who can do what, and protect data in the cloud.',
          topics: ['IAM users, roles & policies', 'Least privilege', 'Encryption & KMS', 'Security groups', 'Audit logging'],
          skills: ['IAM & Security'],
          resources: [
            resource('AWS IAM User Guide', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html', 'Docs'),
          ],
          projects: ['Least-privilege IAM setup for a dev team'],
          estimatedHours: 20,
          certifications: [],
        },
        {
          title: 'Second Cloud: Azure & Google Cloud',
          description: 'Map your AWS knowledge onto Azure and Google Cloud equivalents.',
          topics: ['Azure resource groups & VMs', 'Azure Entra ID', 'GCP projects & IAM', 'Compute Engine & Cloud Storage', 'Service comparisons'],
          skills: ['Azure', 'Google Cloud'],
          resources: [
            resource('Microsoft Learn – Azure Fundamentals', 'https://learn.microsoft.com/en-us/training/courses/az-900t00'),
            resource('Google Cloud Skills Boost', 'https://www.cloudskillsboost.google/'),
          ],
          projects: ['Deploy the same app on Azure and GCP and compare costs'],
          estimatedHours: 40,
          certifications: ['az-900', 'az-104', 'gcp-ace'],
        },
      ],
    },
    {
      title: 'Advanced',
      description: 'Automate infrastructure, run containers, and operate cost-effectively.',
      steps: [
        {
          title: 'Infrastructure as Code with Terraform',
          description: 'Define and version cloud infrastructure as code.',
          topics: ['Providers & resources', 'State management', 'Modules', 'Workspaces & environments', 'Plan/apply in CI'],
          skills: ['Infrastructure as Code'],
          resources: [
            resource('HashiCorp Terraform tutorials', 'https://developer.hashicorp.com/terraform/tutorials'),
          ],
          projects: ['Provision a VPC, EC2, and RDS stack with Terraform modules'],
          estimatedHours: 30,
          certifications: ['terraform-associate'],
        },
        {
          title: 'Containers & Kubernetes Basics',
          description: 'Package applications as containers and run them on managed Kubernetes.',
          topics: ['Docker images & registries', 'Kubernetes pods, deployments & services', 'EKS / AKS / GKE', 'Helm basics'],
          skills: ['Containers'],
          resources: [
            resource('Docker – Get started', 'https://docs.docker.com/get-started/', 'Docs'),
            resource('Kubernetes Basics tutorial', 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', 'Docs'),
          ],
          projects: ['Deploy a containerised API to a managed Kubernetes cluster'],
          estimatedHours: 35,
          certifications: ['cka', 'lfcs'],
        },
        {
          title: 'Monitoring & Cost Optimization',
          description: 'Observe your systems and keep cloud bills under control.',
          topics: ['Metrics, logs & alarms', 'Dashboards', 'Budgets & cost explorer', 'Rightsizing & reserved capacity', 'Tagging strategy'],
          skills: ['Monitoring', 'Cost Optimization'],
          resources: [
            resource('Amazon CloudWatch User Guide', 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html', 'Docs'),
            resource('AWS Well-Architected – Cost Optimization pillar', 'https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html', 'Docs'),
          ],
          projects: ['Alarm + budget setup that alerts on spend and errors'],
          estimatedHours: 20,
          certifications: [],
        },
      ],
    },
    {
      title: 'Job-Ready',
      description: 'Design production architectures and prove it with a capstone.',
      steps: [
        {
          title: 'High-Availability Architecture',
          description: 'Design fault-tolerant, scalable systems using well-architected principles.',
          topics: ['Multi-AZ & multi-region design', 'Auto scaling', 'Disaster recovery strategies', 'Well-Architected Framework'],
          skills: ['High Availability Design'],
          resources: [
            resource('AWS Well-Architected Framework', 'https://aws.amazon.com/architecture/well-architected/', 'Docs'),
            resource('Google Cloud Architecture Center', 'https://cloud.google.com/architecture', 'Docs'),
          ],
          projects: ['Architecture diagram + design doc for a highly available web app'],
          estimatedHours: 40,
          certifications: ['aws-saa', 'aws-dev', 'gcp-pca'],
        },
        {
          title: 'Capstone & Interview Prep',
          description: 'Build a production-style deployment end to end and prepare to explain it.',
          topics: ['Three-tier deployment', 'CI/CD for infrastructure', 'Scenario-based interview questions'],
          skills: [],
          resources: [
            resource('roadmap.sh – AWS', 'https://roadmap.sh/aws', 'Article'),
          ],
          projects: ['Three-tier app on the cloud with Terraform, CI/CD, monitoring, and a cost report'],
          estimatedHours: 40,
          certifications: [],
        },
      ],
    },
  ],
};
