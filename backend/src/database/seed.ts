import 'dotenv/config';

import { AppDataSource } from './data-source';
import { Campaign } from './entities/campaign.entity';
import { ContentItem } from './entities/content-item.entity';
import { EmailList } from './entities/email-list.entity';
import { Subscriber } from './entities/subscriber.entity';
import { Subscription } from './entities/subscription.entity';
import { User } from './entities/user.entity';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceMember } from './entities/workspace-member.entity';
import {
  CampaignStatus,
  ContentType,
  SubscriberStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  WorkspaceRole,
} from './enums';

async function main() {
  console.log('Starting database seed...');

  await AppDataSource.initialize();

  const users = AppDataSource.getRepository(User);
  const workspaces = AppDataSource.getRepository(Workspace);
  const members = AppDataSource.getRepository(WorkspaceMember);
  const subscriptions = AppDataSource.getRepository(Subscription);
  const emailLists = AppDataSource.getRepository(EmailList);
  const subscribers = AppDataSource.getRepository(Subscriber);
  const campaigns = AppDataSource.getRepository(Campaign);
  const contentItems = AppDataSource.getRepository(ContentItem);

  // Demo user (find-or-create by email)
  let user = await users.findOneBy({ email: 'admin@postara.dev' });
  if (!user) {
    user = await users.save(
      users.create({
        email: 'admin@postara.dev',
        name: 'Admin User',
        emailVerified: true,
      }),
    );
  }
  console.log('Seeded user:', user.email);

  // Demo workspace (find-or-create by slug)
  let workspace = await workspaces.findOneBy({ slug: 'demo-workspace' });
  if (!workspace) {
    workspace = await workspaces.save(
      workspaces.create({
        name: 'Demo Workspace',
        slug: 'demo-workspace',
        description: 'A demo workspace for testing',
        ownerId: user.id,
      }),
    );
  }
  console.log('Seeded workspace:', workspace.name);

  // Owner membership
  const existingMember = await members.findOneBy({ workspaceId: workspace.id, userId: user.id });
  if (!existingMember) {
    await members.save(
      members.create({ workspaceId: workspace.id, userId: user.id, role: WorkspaceRole.OWNER }),
    );
  }
  console.log('Seeded workspace membership');

  // Trial subscription
  let subscription = await subscriptions.findOneBy({ workspaceId: workspace.id });
  if (!subscription) {
    subscription = await subscriptions.save(
      subscriptions.create({
        workspaceId: workspace.id,
        plan: SubscriptionPlan.PROFESSIONAL,
        status: SubscriptionStatus.TRIAL,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      }),
    );
  }
  console.log('Seeded subscription:', subscription.plan);

  // Email list
  let emailList = await emailLists.findOneBy({ workspaceId: workspace.id, name: 'Newsletter Subscribers' });
  if (!emailList) {
    emailList = await emailLists.save(
      emailLists.create({
        workspaceId: workspace.id,
        name: 'Newsletter Subscribers',
        description: 'Main newsletter subscriber list',
      }),
    );
  }
  console.log('Seeded email list:', emailList.name);

  // Sample subscribers
  const samples = [
    { email: 'subscriber1@example.com', firstName: 'John', lastName: 'Doe' },
    { email: 'subscriber2@example.com', firstName: 'Jane', lastName: 'Smith' },
  ];
  for (const sample of samples) {
    const existing = await subscribers.findOneBy({ listId: emailList.id, email: sample.email });
    if (!existing) {
      await subscribers.save(
        subscribers.create({
          ...sample,
          listId: emailList.id,
          status: SubscriberStatus.SUBSCRIBED,
          subscribedAt: new Date(),
        }),
      );
    }
  }
  console.log('Seeded subscribers');

  // Draft campaign
  const existingCampaign = await campaigns.findOneBy({
    workspaceId: workspace.id,
    name: 'Welcome Campaign',
  });
  if (!existingCampaign) {
    await campaigns.save(
      campaigns.create({
        workspaceId: workspace.id,
        listId: emailList.id,
        name: 'Welcome Campaign',
        subject: 'Welcome to Postara!',
        preheader: 'Get started with our marketing automation platform',
        fromName: 'Postara Team',
        fromEmail: 'hello@postara.dev',
        content: "<h1>Welcome to Postara!</h1><p>We're excited to have you on board.</p>",
        status: CampaignStatus.DRAFT,
      }),
    );
  }
  console.log('Seeded campaign');

  // Content library items
  const templates: Array<{ title: string; content: string; type: ContentType; tags: string[] }> = [
    {
      title: 'Welcome Email Template',
      content: '<h1>Welcome!</h1><p>Thanks for subscribing to our newsletter.</p>',
      type: ContentType.EMAIL,
      tags: ['welcome', 'template'],
    },
    {
      title: 'Product Launch Post',
      content: 'Excited to announce our new product launch! Check it out at [link]',
      type: ContentType.SOCIAL,
      tags: ['product', 'launch'],
    },
  ];
  for (const template of templates) {
    const existing = await contentItems.findOneBy({ workspaceId: workspace.id, title: template.title });
    if (!existing) {
      await contentItems.save(
        contentItems.create({ ...template, workspaceId: workspace.id, userId: user.id }),
      );
    }
  }
  console.log('Seeded content library');

  await AppDataSource.destroy();
  console.log('Database seed completed successfully!');
}

main().catch(async (error) => {
  console.error('Error seeding database:', error);
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  process.exit(1);
});
