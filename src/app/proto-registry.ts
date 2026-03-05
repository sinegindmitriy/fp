export interface ProtoMeta {
  slug: string;
  title: string;
  figma?: string;
  status: 'wip' | 'live' | 'archived';
  description?: string;
}

// This array is managed by scripts/new-proto.js
// DO NOT edit manually — run the script to add entries
export const PROTO_REGISTRY: ProtoMeta[] = [
    {
    slug: 'deal-room',
    title: 'Deal Room Dashboard',
    figma: 'https://www.figma.com/design/liyNDiFf1piO8SQmHNKoeU?node-id=1042:12890',
    status: 'wip',
    description: 'Active deals overview with quick actions',
  },
  {
    slug: 'integrations-template',
    title: 'Integrations – Project Template',
    figma: 'https://www.figma.com/design/PITzEfwRA26GWSG2MvzmDy?node-id=41340:91979',
    status: 'wip',
    description: 'CA project template settings — Integrations tab with enable/disable flow and CA-locked state',
  },
  // REGISTRY_PLACEHOLDER
];
