import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding news...');

    // 1. Ensure a user exists to be the author
    let user = await prisma.user.findFirst({
        where: { email: 'admin@takaful.org' },
    });

    if (!user) {
        console.log('Creating admin user for authoring news...');
        // In a real app, hash the password. For seeding/dev, this is fine or use a helper if available.
        // However, since I don't have bcrypt imported here and don't want to break things,
        // I'll check if there is ANY user.
        const anyUser = await prisma.user.findFirst();
        if (anyUser) {
            user = anyUser;
            console.log(`Using existing user: ${user.email}`);
        } else {
            // Create a dummy user if absolutely no user exists
            user = await prisma.user.create({
                data: {
                    email: 'admin@takaful.org',
                    name: 'Admin User',
                    password: 'hashed_password_placeholder', // assumption
                    role: 'admin'
                }
            });
            console.log('Created admin user.');
        }
    }

    // 2. Define News Data (Arabic)
    const newsData = [
        {
            title: "انطلاق حملة 'شتاء دافئ' لمساعدة العائلات المحتاجة في المناطق الجبلية",
            content: "أطلقت جمعية التكافل اليوم حملتها السنوية 'شتاء دافئ' التي تستهدف توزيع الأغطية والمدافئ والمواد الغذائية على أكثر من 500 عائلة في القرى الجبلية النائية. تأتي هذه المبادرة استجابة لموجة البرد القارس التي تشهدها المنطقة، وتهدف الحمله إلى توفير الدفء والأمان للأسر المتعففة. \n\n وقد صرح رئيس الجمعية بأن الفرق الميدانية قد بدأت بالفعل في عملية الاحصاء والتوزيع، مؤكداً على أهمية تضافر جهود المحسنين والمتطوعين لإنجاح هذه المهمة الإنسانية النبيلة.",
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop",
            isUrgent: false,
        },
        {
            title: "توزيع 1000 قفة رمضانية وتجهيز موائد إفطار للصائمين",
            content: "مع حلول شهر رمضان المبارك، نجحت الجمعية في توزيع 1000 قفة غذائية تحتوي على المواد الأساسية للأسر المعوزة في مختلف ولايات الوطن. كما قامت الجمعية بتجهيز خيمتين لإفطار عابري السبيل والمحتاجين، تقدم فيهما وجبات ساخنة يومياً طيلة الشهر الفضيل.\n\n نشكر كل من ساهم في هذا الخير العظيم، ونسأل الله أن يتقبل منا ومنكم صالح الأعمال.",
            image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
            isUrgent: false,
        },
        {
            title: "قافلة طبية متعددة التخصصات تحط الرحال في الجنوب الكبير",
            content: "وصلت صباح اليوم القافلة الطبية التي نظمتها جمعية التكافل إلى ولاية تمنراست، حيث تضم القافلة أطباء في تخصصات العيون، طب الأطفال، والقلب. ستقدم القافلة فحوصات مجانية وأدوية للمواطنين لمدة ثلاثة أيام.\n\n هذه المبادرة تأتي في إطار برنامج 'الصحة للجميع' الذي تسعى الجمعية من خلاله لتقريب الخدمات الصحية من المناطق التي تعاني نقصاً في التغطية الطبية.",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
            isUrgent: true,
        },
        {
            title: "افتتاح مركز 'الأمل' لرعاية الأيتام وتعليمهم",
            content: "في أجواء احتفالية بهيجة، تم اليوم تدشين مركز 'الأمل' الجديد المخصص لرعاية الأيتام. يوفر المركز سكناً لائقاً، برامج تعليمية، ورعاية نفسية لأكثر من 50 يتيماً.\n\n تم تجهيز المركز بأحدث الوسائل التعليمية وقاعات للنشاطات الترفيهية، ليكون بيئة حاضنة تساعد هؤلاء الأطفال على بناء مستقبل مشرق بإذن الله.",
            image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
            isUrgent: false,
        },
        {
            title: "نداء عاجل: حملة للتبرع بالدم لصالح المستشفيات الجامعية",
            content: "تعلن جمعية التكافل عن تنظيم يوم مفتوح للتبرع بالدم بالتنسيق مع المستشفى الجامعي، وذلك يوم السبت القادم بساحة البريد المركزي. ندعو كافة المواطنين للمشاركة بقوة في هذه الحملة لإنقاذ أرواح المرضى الذين هم في أمس الحاجة إلى قطرات الدم.\n\n 'ومن أحياها فكأنما أحيا الناس جميعاً'. كونوا في الموعد.",
            image: "https://images.unsplash.com/photo-1615461066841-6116e61058f5?q=80&w=1000&auto=format&fit=crop",
            isUrgent: true,
        },
        {
            title: "اختتام فعاليات المخيم الصيفي للأطفال ذوي الهمم",
            content: "اختتمت مساء أمس فعاليات المخيم الصيفي الذي خصصته الجمعية للأطفال ذوي الاحتياجات الخاصة. استفاد الأطفال من برامج ترفيهية، ورشات رسم، ومسابقات رياضية مكيفة، في أجواء مليئة بالفرح والسعادة.\n\n تهدف هذه الأنشطة إلى دمج هذه الفئة الغالية في المجتمع ورسم البسمة على وجوههم.",
            image: "https://images.unsplash.com/photo-1518398046805-4166c9a24268?q=80&w=2070&auto=format&fit=crop",
            isUrgent: false,
        },
    ];

    console.log(`Adding ${newsData.length} news items...`);

    for (const news of newsData) {
        await prisma.news.create({
            data: {
                ...news,
                authorId: user.id,
                publishedAt: new Date(), // Set to now
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
