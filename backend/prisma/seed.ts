import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'admin@postara.dev' },
    update: {},
    create: {
      email: 'admin@postara.dev',
      name: 'Admin User',
      emailVerified: new Date(),
      password: '$2a$10$YourHashedPasswordHere', // Replace with actual hashed password
    },
  });

  console.log('✅ Created user:', user.email);

  // Create a workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'demo-workspace' },
    update: {},
    create: {
      name: 'Demo Workspace',
      slug: 'demo-workspace',
      description: 'A demo workspace for testing',
      ownerId: user.id,
    },
  });

  console.log('✅ Created workspace:', workspace.name);

  // Add user as workspace member
  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'OWNER',
    },
  });

  console.log('✅ Added user to workspace');

  // Create a subscription
  const subscription = await prisma.subscription.upsert({
    where: { workspaceId: workspace.id },
    update: {},
    create: {
      workspaceId: workspace.id,
      plan: 'PROFESSIONAL',
      status: 'TRIAL',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
    },
  });

  console.log('✅ Created subscription:', subscription.plan);

  // Create an email list
  const emailList = await prisma.emailList.create({
    data: {
      workspaceId: workspace.id,
      name: 'Newsletter Subscribers',
      description: 'Main newsletter subscriber list',
    },
  });

  console.log('✅ Created email list:', emailList.name);

  // Create sample subscribers
  const subscribers = await Promise.all([
    prisma.subscriber.create({
      data: {
        listId: emailList.id,
        email: 'subscriber1@example.com',
        firstName: 'John',
        lastName: 'Doe',
        status: 'SUBSCRIBED',
        subscribedAt: new Date(),
      },
    }),
    prisma.subscriber.create({
      data: {
        listId: emailList.id,
        email: 'subscriber2@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        status: 'SUBSCRIBED',
        subscribedAt: new Date(),
      },
    }),
  ]);

  console.log(`✅ Created ${subscribers.length} subscribers`);

  // Create a draft campaign
  const campaign = await prisma.campaign.create({
    data: {
      workspaceId: workspace.id,
      listId: emailList.id,
      name: 'Welcome Campaign',
      subject: 'Welcome to Postara!',
      preheader: 'Get started with our marketing automation platform',
      fromName: 'Postara Team',
      fromEmail: 'hello@postara.dev',
      content: '<h1>Welcome to Postara!</h1><p>We\'re excited to have you on board.</p>',
      status: 'DRAFT',
    },
  });

  console.log('✅ Created campaign:', campaign.name);

  // Create content library items
  const contentItems = await Promise.all([
    prisma.contentLibrary.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        title: 'Welcome Email Template',
        content: '<h1>Welcome!</h1><p>Thanks for subscribing to our newsletter.</p>',
        type: 'EMAIL',
        tags: ['welcome', 'template'],
      },
    }),
    prisma.contentLibrary.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        title: 'Product Launch Post',
        content: '🚀 Excited to announce our new product launch! Check it out at [link]',
        type: 'SOCIAL',
        tags: ['product', 'launch'],
      },
    }),
  ]);

  console.log(`✅ Created ${contentItems.length} content library items`);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
