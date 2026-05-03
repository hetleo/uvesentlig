import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const adapter = new PrismaLibSql({ url });
  const prisma = new PrismaClient({ adapter } as any);

  console.log("Seeding database…");

  // Hash the admin password if set
  const rawPw = process.env.ADMIN_PASSWORD ?? "leon1980";
  const hash = await bcrypt.hash(rawPw, 12);
  console.log(`\nAdmin password hash (add to .env as ADMIN_PASSWORD_HASH):\n${hash}\n`);

  // Sample blog posts
  await prisma.post.createMany({
    data: [
      {
        slug: "om-aa-plante-noe-og-glemme-det",
        title: "Om å plante noe og glemme det",
        ingress: "Noe om hager, tålmodighet, og hva som skjer når du ikke passer på.",
        content: `# Om å plante noe og glemme det

Det begynner alltid i april. Lyset henger igjen lenger enn du forventer, og plutselig er det ikke mørkt når du spiser middag.

Jeg plantet en rosemarin i 2019. Glemte den bak søppelkassene. I 2023 fant jeg en liten busk der — hardfør, litt sur på meg, men levende.

> «Det vokser best det som ikke blir passet på for mye.»

Det er noe i det. Kanskje er oppmerksomhet ikke alltid en gave.

## Hva hagen lærte meg

Å gi noe tid uten å vente på resultat er vanskelig. Vi er ikke laget for det. Men hagen krever det.`,
        tags: "hage, tanker",
        published: true,
        publishedAt: new Date("2026-04-28"),
      },
      {
        slug: "tre-kvelder-med-taarnsvale",
        title: "Tre kvelder med tårnsvale",
        ingress: "Maridalen i april. Fuglen som ikke lander.",
        content: `# Tre kvelder med tårnsvale

Det begynner i april. Lyset henger igjen lenger enn før, og det er som om himmelen nekter å gi seg.

Tårnsvalen lander aldri. Den sover, spiser, parer seg — alt i luften. En slik eksistens.

![Kveldshimmel over Maridalen](maridalen-kveld.jpg)

> «… og så stilner alt, slik det gjør på den ene minuttet før mørket.»

Tre kvelder. Tre ganger sto jeg ved Maridalsvann og så dem gli over vannflaten som om de var eid av en annen planet.`,
        tags: "fugl, maridalen",
        published: true,
        publishedAt: new Date("2026-04-19"),
      },
      {
        slug: "hvorfor-jeg-sluttet-aa-rydde-dotfiles",
        title: "Hvorfor jeg sluttet å rydde dotfiles",
        ingress: "Orden for ordenens skyld er et tidstyv.",
        content: `# Hvorfor jeg sluttet å rydde dotfiles

I årevis hadde jeg et perfekt organisert \`.config\`-katalog. Symlinker, stow, git repo, CI som sjekket at alt kompilerte.

Og så sluttet jeg.

\`\`\`bash
# Denne kommandoen er nå ukommentert i ~/.zshrc
# source ~/.config/aliases.sh
\`\`\`

Poenget er: verktøy skal tjene deg, ikke omvendt.`,
        tags: "kode",
        published: true,
        publishedAt: new Date("2026-04-04"),
      },
    ],

  });

  // Sample projects
  await prisma.project.createMany({
    data: [
      {
        slug: "hagedagbok",
        name: "Hagedagbok",
        category: "hage / kode",
        status: "pågående",
        description: "En digital dagbok for alt som skjer i hagen. Plantet, spiret, visnet, overlevde.",
        tags: "hage, natur",
        startedAt: new Date("2026-03-01"),
        links: "GitHub=https://github.com/leon/hagedagbok",
      },
      {
        slug: "nattfugler-i-maridalen",
        name: "Nattfugler i Maridalen",
        category: "fuglekikking",
        status: "pågående",
        description: "Dokumenterer nattfugler i Marka med lydopptak og observasjoner.",
        tags: "fugl, maridalen, natur",
        startedAt: new Date("2026-04-02"),
        links: "eBird=https://ebird.org/leon",
      },
      {
        slug: "plotter-eksperimenter",
        name: "Plotter-eksperimenter",
        category: "kode / kunst",
        status: "pause",
        description: "Generativ kunst med en AxiDraw-plotter. På pause mens jeg venter på blekk.",
        tags: "kode, kunst",
        startedAt: new Date("2025-01-01"),
      },
    ],

  });

  // Sample books
  await prisma.book.createMany({
    data: [
      {
        title: "Solenoid",
        author: "Mircea Cărtărescu",
        year: "2015",
        isbn: "9781804270097",
        status: "leser",
        location: "kontor",
        progress: 62,
      },
      {
        title: "The Overstory",
        author: "Richard Powers",
        year: "2018",
        isbn: "9780393356687",
        status: "leser",
        location: "stue",
        progress: 18,
      },
      {
        title: "Pilegrim ved Tinker Creek",
        author: "Annie Dillard",
        year: "1974",
        status: "lest",
        location: "kontor",
        progress: 100,
      },
      {
        title: "Stoner",
        author: "John Williams",
        year: "1965",
        status: "lest",
        location: "stue",
        progress: 100,
      },
      {
        title: "Underland",
        author: "Robert Macfarlane",
        year: "2019",
        status: "utlånt",
        location: "utlånt → A.",
        progress: 70,
      },
    ],

  });

  console.log("Seed complete.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
