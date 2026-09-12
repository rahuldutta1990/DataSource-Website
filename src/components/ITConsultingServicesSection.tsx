import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Search,
  Layers,
  Laptop,
  RefreshCw,
  Cloud,
  Cpu,
  Workflow,
  DollarSign,
  Milestone,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Target,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal,
  FileText,
} from 'lucide-react';
import { Eyebrow } from './Eyebrow.js';

export interface ITConsultingService {
  id: string;
  title: string;
  slug: string;
  shortTitle: string;
  icon: React.ElementType;
  badge: string;
  summary: string;
  businessProblem: {
    title: string;
    description: string;
    symptoms: string[];
  };
  whatWeAssess: {
    title: string;
    items: string[];
  };
  whatWeRecommend: {
    title: string;
    items: string[];
  };
  expectedBusinessOutcome: {
    title: string;
    outcomes: string[];
  };
}

export const IT_CONSULTING_SERVICES: ITConsultingService[] = [
  {
    id: 'it-strategy',
    title: 'IT Strategy Consulting',
    slug: 'it-strategy',
    shortTitle: 'IT Strategy',
    icon: Compass,
    badge: 'Strategic Alignment',
    summary:
      'Align technology initiatives directly with core business objectives, capital allocation, and long-term operational scale.',
    businessProblem: {
      title: 'Business Problem',
      description:
        'Technology initiatives often operate in isolation from overarching business goals. Without a unified strategy, organizations experience fragmented software tools, misaligned capital expenditure, redundant platforms, and delayed market opportunities.',
      symptoms: [
        'Uncoordinated IT investments across departments',
        'Frequent shifting of technical priorities without clear ROI',
        'Misalignment between executive leadership and engineering teams',
      ],
    },
    whatWeAssess: {
      title: 'What We Assess',
      items: [
        'Executive business objectives and multi-year growth targets',
        'Current IT expenditure vs. measurable commercial outcomes',
        'Organizational software stack usage and cross-departmental data flows',
        'Internal technical skill sets, team capacity, and governance policies',
        'Risk exposure regarding vendor lock-in and technology obsolescence',
      ],
    },
    whatWeRecommend: {
      title: 'What We Recommend',
      items: [
        'A comprehensive multi-year technology strategy aligned with business milestones',
        'Standardized enterprise architecture guidelines and software evaluation criteria',
        'Capital allocation frameworks prioritizing high-ROI technical initiatives',
        'Clear IT governance policies and technical leadership alignment models',
      ],
    },
    expectedBusinessOutcome: {
      title: 'Expected Business Outcome',
      outcomes: [
        'Unified technology direction across executive and engineering teams',
        'Elimination of redundant software initiatives and wasted development capital',
        'Optimized IT budget allocation focused on core business differentiators',
        'Improved speed and predictability in delivering strategic digital capabilities',
      ],
    },
  },
  {
    id: 'technology-assessment',
    title: 'Technology Assessment & Technical Audit',
    slug: 'technology-assessment',
    shortTitle: 'Technology Assessment',
    icon: Search,
    badge: 'Technical Due Diligence',
    summary:
      'Independent evaluation of codebases, technical debt, infrastructure health, security postures, and scalability boundaries.',
    businessProblem: {
      title: 'Business Problem',
      description:
        'Organizations often lack objective, unbiased visibility into the technical health and risk exposure of their existing software applications. Undetected technical debt, security vulnerabilities, and architectural bottlenecks lead to unexpected outages and ballooning maintenance costs.',
      symptoms: [
        'Increasing frequency of application bugs and unexplained performance slowdowns',
        'High developer friction and slow turnaround time for new features',
        'Uncertainty regarding security patch status and code maintainability',
      ],
    },
    whatWeAssess: {
      title: 'What We Assess',
      items: [
        'Source code maintainability, static analysis metrics, and structural code quality',
        'Third-party library dependencies, license risks, and security vulnerabilities',
        'Database schema normalization, indexing efficiency, and query performance',
        'API latency, concurrency limits, and system failure recovery mechanisms',
        'Cloud infrastructure configuration, access policies, and resource utilization',
      ],
    },
    whatWeRecommend: {
      title: 'What We Recommend',
      items: [
        'Prioritized technical debt remediation matrix categorized by risk and effort',
        'Immediate security patching and vulnerability mitigation guidelines',
        'Targeted code refactoring plans for critical performance bottlenecks',
        'Infrastructure hardening and automated testing specifications',
      ],
    },
    expectedBusinessOutcome: {
      title: 'Expected Business Outcome',
      outcomes: [
        'Mitigated risk of unexpected system outages and security breaches',
        'Transparent code quality and architectural health metrics for stakeholders',
        'Reduced long-term software maintenance overhead',
        'Clear, actionable prioritization for engineering roadmaps',
      ],
    },
  },
  {
    id: 'system-architecture',
    title: 'System Architecture & Design',
    slug: 'system-architecture',
    shortTitle: 'System Architecture',
    icon: Layers,
    badge: 'Scalable Systems',
    summary:
      'Design resilient, modular software and cloud topologies built to handle high concurrency and seamless feature growth.',
    businessProblem: {
      title: 'Business Problem',
      description:
        'Monolithic, tightly-coupled, or poorly structured software systems struggle under growing user loads. Inflexible architectures lead to cascading failures during traffic surges, long deployment cycles, and difficult feature additions.',
      symptoms: [
        'System crashes or severe slowdowns during peak user traffic',
        'A bug in one component bringing down the entire application',
        'High complexity when attempting to modify or add specific modules',
      ],
    },
    whatWeAssess: {
      title: 'What We Assess',
      items: [
        'Data flow topologies, message passing formats, and system component boundaries',
        'Tight coupling between frontend, backend microservices, and databases',
        'Caching layers, state management strategies, and session handling',
        'Database query efficiency, connection pooling, and read/write scaling',
        'System failure domains and disaster recovery isolation boundaries',
      ],
    },
    whatWeRecommend: {
      title: 'What We Recommend',
      items: [
        'Resilient modular or microservice architectures tailored to operational scale',
        'Event-driven message queuing for asynchronous background processing',
        'Distributed caching layers (e.g., Redis) to offload database reads',
        'High-availability database replication and connection pool configurations',
      ],
    },
    expectedBusinessOutcome: {
      title: 'Expected Business Outcome',
      outcomes: [
        'High system availability and uptime SLAs during high concurrency',
        'Predictable horizontal scalability as user demand expands',
        'Faster feature deployment velocity with isolated service boundaries',
        'Reduced blast radius of system errors, preventing full outages',
      ],
    },
  },
  {
    id: 'website-technology-selection',
    title: 'Website & Technology Selection Advisory',
    slug: 'website-technology-selection',
    shortTitle: 'Website & Tech Selection',
    icon: Laptop,
    badge: 'Platform Selection',
    summary:
      'Objective evaluation and framework selection for web applications, CMS platforms, and SaaS ecosystems to prevent vendor lock-in.',
    businessProblem: {
      title: 'Business Problem',
      description:
        'Organizations frequently choose software frameworks, CMS tools, or enterprise SaaS platforms based on marketing claims rather than technical fit. This leads to costly licensing, poor performance, lack of customizability, and premature re-platforming.',
      symptoms: [
        'Outgrowing a closed CMS or no-code platform due to custom requirements',
        'High recurring subscription costs for underutilized enterprise software',
        'Difficulty integrating selected web platforms with internal databases',
      ],
    },
    whatWeAssess: {
      title: 'What We Assess',
      items: [
        'Functional requirements, content workflows, and custom feature needs',
        'Internal engineering team skill sets and ongoing maintenance capacity',
        'Total Cost of Ownership (TCO) including licensing, hosting, and developer fees',
        'API extensibility, data export capabilities, and vendor lock-in risks',
        'Performance benchmarks, SEO capability, and security compliance standards',
      ],
    },
    whatWeRecommend: {
      title: 'What We Recommend',
      items: [
        'Objective build vs. buy evaluation matrices tailored to business scale',
        'Unbiased shortlisting of web frameworks (e.g., React/Next.js vs. Headless CMS)',
        'Vendor RFP scoring systems and technical feature comparison models',
        'Proof-of-Concept (PoC) architecture prototypes to validate selection',
      ],
    },
    expectedBusinessOutcome: {
      title: 'Expected Business Outcome',
      outcomes: [
        'Avoidance of expensive platform migrations due to poor initial selection',
        'Selection of future-proof technology stacks matching internal team capabilities',
        'Optimized licensing spend and predictable operational hosting expenses',
        'High web performance, SEO compliance, and flexible custom capability',
      ],
    },
  },
  {
    id: 'legacy-system-modernisation',
    title: 'Legacy System Modernisation',
    slug: 'legacy-system-modernisation',
    shortTitle: 'Legacy Modernisation',
    icon: RefreshCw,
    badge: 'Refactoring & Replatforming',
    summary:
      'Transform brittle legacy applications into modern, API-driven web and cloud architectures without operational downtime.',
    businessProblem: {
      title: 'Business Problem',
      description:
        'Core business operations often rely on legacy software built on outdated stacks. These systems are expensive to maintain, lack modern API integration capabilities, create security liabilities, and rely on scarce engineering talent.',
      symptoms: [
        'Key business processes tied to on-premise, unsupported software versions',
        'Inability to connect legacy data to modern dashboards or web applications',
        'High risk of catastrophic system failure with no clear recovery documentation',
      ],
    },
    whatWeAssess: {
      title: 'What We Assess',
      items: [
        'Legacy codebase structure, language dependencies, and technical debt',
        'Embedded business rules inside legacy stored procedures or monolithic code',
        'Database schemas, data integrity constraints, and extraction bottlenecks',
        'Integration points with external third-party tools and internal workflows',
        'Operational downtime tolerance during migration or refactoring phases',
      ],
    },
    whatWeRecommend: {
      title: 'What We Recommend',
      items: [
        'Phased modernization using the Strangler Fig pattern to replace modules incrementally',
        'API encapsulation around legacy core logic to enable modern web frontends',
        'Containerization of legacy services for deployment flexibility',
        'Zero-downtime database migration and data transformation pipelines',
      ],
    },
    expectedBusinessOutcome: {
      title: 'Expected Business Outcome',
      outcomes: [
        'Significantly lower ongoing software maintenance overhead',
        'Ability to integrate legacy data into modern web and mobile workflows',
        'Eliminated risk of operational disruption from obsolete technologies',
        'Easier onboarding for new engineering team members',
      ],
    },
  },
  {
    id: 'cloud-consulting',
    title: 'Cloud Consulting & Migration Strategy',
    slug: 'cloud-consulting',
    shortTitle: 'Cloud Consulting',
    icon: Cloud,
    badge: 'Cloud Infrastructure',
    summary:
      'Migrate, architect, and optimize workloads on AWS, GCP, or Azure with auto-scaling elasticity and hardened security.',
    businessProblem: {
      title: 'Business Problem',
      description:
        'Unplanned cloud migrations or poorly managed cloud environments result in spiraling monthly bills, security misconfigurations, and inefficient resource allocation across multi-cloud or hybrid infrastructures.',
      symptoms: [
        'Unpredictable cloud bills that increase faster than business growth',
        'Security compliance concerns regarding cloud storage and data access',
        'Manual server provisioning and lack of automated deployment pipelines',
      ],
    },
    whatWeAssess: {
      title: 'What We Assess',
      items: [
        'Current server utilization rates, instance sizing, and resource allocations',
        'IAM role configurations, network security groups, and public access points',
        'Backup frequencies, disaster recovery plans, and cross-region redundancy',
        'Containerization readiness and continuous deployment (CI/CD) pipelines',
        'Monthly cloud line items to identify unused or over-provisioned services',
      ],
    },
    whatWeRecommend: {
      title: 'What We Recommend',
      items: [
        'Cloud-native re-architecting plans utilizing containerization (Docker/Kubernetes)',
        'Automated auto-scaling configurations to match compute with real-time demand',
        'Infrastructure as Code (IaC) templates (Terraform/CloudFormation) for rapid setup',
        'Hardened cloud security governance and automated compliance scanning',
      ],
    },
    expectedBusinessOutcome: {
      title: 'Expected Business Outcome',
      outcomes: [
        'Predictable cloud infrastructure spend with optimized resource sizing',
        'Elastic auto-scaling capabilities during unexpected traffic surges',
        'Hardened cloud security posture adhering to industry standards',
        'Streamlined, zero-downtime automated deployment pipelines',
      ],
    },
  },
  {
    id: 'integration-consulting',
    title: 'System Integration & Middleware Consulting',
    slug: 'integration-consulting',
    shortTitle: 'Integration & APIs',
    icon: Cpu,
    badge: 'API & Middleware',
    summary:
      'Connect isolated ERP, CRM, financial, and internal tools into unified, automated real-time data workflows.',
    businessProblem: {
      title: 'Business Problem',
      description:
        'Core enterprise software systems (ERP, CRM, finance, e-commerce, custom databases) frequently operate in isolated silos. Employees spend hours manually exporting CSV files, re-entering data, and resolving sync errors.',
      symptoms: [
        'Duplicate data entry across multiple internal applications',
        'Discrepancies between customer data in CRM vs. billing platforms',
        'Lack of real-time visibility across operational business metrics',
      ],
    },
    whatWeAssess: {
      title: 'What We Assess',
      items: [
        'Existing REST, SOAP, or GraphQL API coverage across core software tools',
        'Data schemas, field mapping requirements, and payload formats',
        'Data synchronization frequency needs (real-time webhooks vs. batch jobs)',
        'Rate limits, authentication protocols, and error handling mechanisms',
        'System throughput limits and potential bottleneck points',
      ],
    },
    whatWeRecommend: {
      title: 'What We Recommend',
      items: [
        'Custom lightweight REST/GraphQL middleware design for seamless system connectivity',
        'Asynchronous event brokers (e.g., RabbitMQ, Redis, Kafka) for high-reliability message delivery',
        'Automated dead-letter queues and retry mechanisms for failed transactions',
        'Data transformation adapters ensuring schema consistency across applications',
      ],
    },
    expectedBusinessOutcome: {
      title: 'Expected Business Outcome',
      outcomes: [
        'Automated end-to-end data synchronization between business applications',
        'Elimination of manual duplicate data entry and associated human errors',
        'Real-time operational visibility across departments',
        'High system fault-tolerance with automated error logging and retries',
      ],
    },
  },
  {
    id: 'process-automation',
    title: 'Process Automation & Operational Workflows',
    slug: 'process-automation',
    shortTitle: 'Process Automation',
    icon: Workflow,
    badge: 'Workflow Engineering',
    summary:
      'Eliminate repetitive manual tasks, spreadsheet handoffs, and operational bottlenecks with custom background automation.',
    businessProblem: {
      title: 'Business Problem',
      description:
        'High-volume operational workflows depend heavily on manual approval chains, email handoffs, and spreadsheet tracking. This causes operational friction, delays, human errors, and reduced employee productivity.',
      symptoms: [
        'Slow processing times for customer orders, approvals, or onboarding',
        'High error rates in manual report preparation and data collection',
        'Employees spending significant time on repetitive administrative tasks',
      ],
    },
    whatWeAssess: {
      title: 'What We Assess',
      items: [
        'Step-by-step operational workflows and departmental handoff points',
        'Document approval chains, data validation criteria, and notification logic',
        'Volume and frequency of repetitive manual tasks across teams',
        'Historical error rates and bottleneck locations in current processes',
        'Software APIs available for automation integration',
      ],
    },
    whatWeRecommend: {
      title: 'What We Recommend',
      items: [
        'Custom background workflow automation services tailored to exact business logic',
        'Rule-based automated validation microservices for incoming data',
        'Automated event notification pipelines via Slack, email, or SMS',
        'Centralized status tracking dashboards for operational visibility',
      ],
    },
    expectedBusinessOutcome: {
      title: 'Expected Business Outcome',
      outcomes: [
        'Accelerated task turnaround times from days to seconds',
        'Elimination of manual data entry errors and missing records',
        'Complete audit trails for operational compliance and tracking',
        'Reallocation of staff time to strategic, revenue-generating activities',
      ],
    },
  },
  {
    id: 'it-cost-optimisation',
    title: 'IT Cost & Infrastructure Optimisation',
    slug: 'it-cost-optimisation',
    shortTitle: 'IT Cost Optimisation',
    icon: DollarSign,
    badge: 'Cost Efficiency',
    summary:
      'Audit and eliminate idle cloud servers, redundant SaaS licenses, and over-provisioned infrastructure to maximize IT ROI.',
    businessProblem: {
      title: 'Business Problem',
      description:
        'Unmonitored cloud resource usage, abandoned staging environments, unused SaaS software licenses, and over-provisioned database instances quietly inflate annual IT budgets without adding business value.',
      symptoms: [
        'Cloud hosting expenditures growing month-over-month without increase in user traffic',
        'Multiple tools purchased by different teams fulfilling the same function',
        'Lack of clear cost attribution per department or application feature',
      ],
    },
    whatWeAssess: {
      title: 'What We Assess',
      items: [
        'Monthly cloud infrastructure bills line-by-line across all regions',
        'Server CPU, memory, and disk IOPS utilization metrics over 30-90 days',
        'Active SaaS user licenses vs. actual employee login activity',
        'Storage tiering policies for cold vs. hot data archives',
        'Third-party API call usage and billing models',
      ],
    },
    whatWeRecommend: {
      title: 'What We Recommend',
      items: [
        'Cloud instance right-sizing and migration to modern compute generations',
        'Reserved instance and savings plan commitment modeling for predictable workloads',
        'Automated storage lifecycle rules to transition old data to low-cost tiers',
        'Consolidation or cancellation of redundant SaaS software subscriptions',
      ],
    },
    expectedBusinessOutcome: {
      title: 'Expected Business Outcome',
      outcomes: [
        'Direct, immediate reduction in recurring monthly cloud infrastructure costs',
        'Optimal resource utilization ratios across compute and database assets',
        'Transparent cost tracking per business unit or application module',
        'Elimination of wasted expenditure on unused software licenses',
      ],
    },
  },
  {
    id: 'technology-roadmap-planning',
    title: 'Strategic Technology Roadmap Planning',
    slug: 'technology-roadmap-planning',
    shortTitle: 'Technology Roadmap',
    icon: Milestone,
    badge: 'Multi-Quarter Planning',
    summary:
      'Build a structured, multi-quarter execution blueprint with clear milestones, risk mitigation, and capacity planning.',
    businessProblem: {
      title: 'Business Problem',
      description:
        'Leadership teams often lack a structured, multi-quarter timetable for technical investments. This leads to team burnout, missed launch deadlines, resource conflicts, and reactionary decision-making.',
      symptoms: [
        'Engineering teams constantly working in crisis mode without long-term plans',
        'Key software initiatives delayed due to unexpected technical dependencies',
        'Unclear resource requirements and budget estimates for upcoming quarters',
      ],
    },
    whatWeAssess: {
      title: 'What We Assess',
      items: [
        'Long-term corporate growth objectives and product launch targets',
        'Technical prerequisites, architecture dependencies, and critical paths',
        'Current team velocity, capacity, and specialized skill availability',
        'Compliance, security, and regulatory implementation deadlines',
        'Budget allocations and financial constraints per planning period',
      ],
    },
    whatWeRecommend: {
      title: 'What We Recommend',
      items: [
        'A phased multi-quarter technology execution roadmap with clear milestones',
        'Detailed dependency mapping to prevent architectural bottlenecks',
        'Capacity and staffing models for engineering project execution',
        'Risk mitigation contingencies and milestone sign-off criteria',
      ],
    },
    expectedBusinessOutcome: {
      title: 'Expected Business Outcome',
      outcomes: [
        'Clear alignment between executive strategy and engineering execution',
        'Predictable, milestone-driven product launch schedules',
        'Minimized project execution risk through proactive dependency resolution',
        'Transparent tracking of project progress and resource consumption',
      ],
    },
  },
];

export const ITConsultingServicesSection: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    IT_CONSULTING_SERVICES[0].id
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeService =
    IT_CONSULTING_SERVICES.find((s) => s.id === selectedServiceId) ||
    IT_CONSULTING_SERVICES[0];

  const filteredServices = IT_CONSULTING_SERVICES.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ActiveIcon = activeService.icon;

  return (
    <section
      id="it-consulting-practices"
      className="py-16 sm:py-24 bg-white dark:bg-[#070D18] border-b border-slate-200/80 dark:border-slate-800 relative overflow-hidden text-left"
    >
      {/* Subtle Background Accents */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Eyebrow text="Core IT Consulting Practices" variant="blue" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B2B] dark:text-white tracking-tight font-heading mt-3 leading-tight">
            Comprehensive IT Consulting &amp; Advisory
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-4 leading-relaxed font-body">
            Pragmatic, problem-first technology consulting across 10 specialized disciplines. Every practice evaluates your operational pain points first, assesses technical realities, recommends proven modern solutions, and delivers clear business outcomes.
          </p>
        </div>

        {/* Search & Quick Nav Bar */}
        <div className="mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0 px-2 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0077FF] dark:text-[#38BDF8]" />
              Practices:
            </span>
            {IT_CONSULTING_SERVICES.map((serv) => {
              const isSelected = serv.id === activeService.id;
              return (
                <button
                  key={serv.id}
                  onClick={() => setSelectedServiceId(serv.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0077FF] text-white shadow-sm shadow-blue-500/20'
                      : 'bg-white dark:bg-[#132034] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  <serv.icon className="w-3.5 h-3.5" />
                  <span>{serv.shortTitle}</span>
                </button>
              );
            })}
          </div>

          <div className="w-full md:w-64 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 10 IT practices..."
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-[#132034] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#0077FF] dark:focus:border-[#38BDF8]"
            />
          </div>
        </div>

        {/* Main 2-Column Desktop Grid / Detailed Active Card Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: List of 10 IT Consulting Services (4 cols) */}
          <div className="lg:col-span-4 space-y-3 max-h-[780px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredServices.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0E1726] rounded-2xl border border-slate-200 dark:border-slate-800">
                No IT consulting practices found matching &quot;{searchQuery}&quot;.
              </div>
            ) : (
              filteredServices.map((serv) => {
                const IconComponent = serv.icon;
                const isSelected = serv.id === activeService.id;

                return (
                  <button
                    key={serv.id}
                    onClick={() => setSelectedServiceId(serv.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all border relative flex items-start gap-3.5 group ${
                      isSelected
                        ? 'bg-[#0077FF]/5 dark:bg-[#0077FF]/15 border-[#0077FF] dark:border-[#38BDF8] shadow-md shadow-blue-500/10'
                        : 'bg-white dark:bg-[#0E1726] border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#0077FF] text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-[#132034] text-slate-700 dark:text-slate-300 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8]">
                          {serv.badge}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isSelected
                              ? 'text-[#0077FF] dark:text-[#38BDF8] translate-x-0.5'
                              : 'text-slate-400 dark:text-slate-600'
                          }`}
                        />
                      </div>
                      <h3
                        className={`text-sm font-bold font-heading mt-0.5 transition-colors line-clamp-1 ${
                          isSelected
                            ? 'text-[#0077FF] dark:text-[#38BDF8]'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {serv.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-body">
                        {serv.summary}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Full 4-Part Structured Breakdown of Active Service (8 cols) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#0E1726] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-8"
              >
                {/* Active Service Top Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0077FF]/10 dark:bg-[#0077FF]/20 text-[#0077FF] dark:text-[#38BDF8] flex items-center justify-center border border-[#0077FF]/20 shrink-0">
                      <ActiveIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0077FF] dark:text-[#38BDF8] bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-800/60">
                        {activeService.badge}
                      </span>
                      <h3 className="text-2xl font-bold text-[#0B1B2B] dark:text-white font-heading mt-1">
                        {activeService.title}
                      </h3>
                    </div>
                  </div>

                  <Link
                    to={`/contact?service=${encodeURIComponent(activeService.title)}`}
                    className="inline-flex items-center gap-2 bg-[#0077FF] hover:bg-[#0062D6] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors shrink-0"
                  >
                    <span>Consult On This Practice</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Summary Statement */}
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-body italic bg-slate-50 dark:bg-[#132034] p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  &ldquo;{activeService.summary}&rdquo;
                </p>

                {/* 4-Part Required Structure Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Part 1: Business Problem */}
                  <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
                    <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold font-heading text-base">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <h4>1. Business Problem</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-body">
                      {activeService.businessProblem.description}
                    </p>
                    <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/40 space-y-1.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        Key Symptoms:
                      </p>
                      {activeService.businessProblem.symptoms.map((symptom, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                          <span>{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Part 2: What We Assess */}
                  <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold font-heading text-base">
                      <Search className="w-5 h-5 shrink-0" />
                      <h4>2. What We Assess</h4>
                    </div>
                    <div className="space-y-2">
                      {activeService.whatWeAssess.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Part 3: What We Recommend */}
                  <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-3">
                    <div className="flex items-center gap-2 text-[#0077FF] dark:text-[#38BDF8] font-bold font-heading text-base">
                      <Lightbulb className="w-5 h-5 shrink-0" />
                      <h4>3. What We Recommend</h4>
                    </div>
                    <div className="space-y-2">
                      {activeService.whatWeRecommend.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-[#0077FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Part 4: Expected Business Outcome */}
                  <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold font-heading text-base">
                      <Target className="w-5 h-5 shrink-0" />
                      <h4>4. Expected Business Outcome</h4>
                    </div>
                    <div className="space-y-2">
                      {activeService.expectedBusinessOutcome.outcomes.map((outcome, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="font-medium">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <FileText className="w-4 h-4 text-[#0077FF] dark:text-[#38BDF8]" />
                    <span>Includes complete architectural assessment report &amp; implementation roadmap.</span>
                  </div>

                  <Link
                    to={`/contact?service=${encodeURIComponent(activeService.title)}`}
                    className="w-full sm:w-auto text-center bg-[#0077FF] hover:bg-[#0062D6] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow transition-colors"
                  >
                    Schedule Assessment for {activeService.shortTitle}
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
