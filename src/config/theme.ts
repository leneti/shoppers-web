import "intl";
import "intl/locale-data/jsonp/en-GB";

export const currencyFormat = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 2,
});
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const MONTH_TRUNC = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "June",
  July: "July",
  August: "Aug",
  September: "Sept",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};
// export const CATEGORIES = [
//   { name: "Bills", image: require(`../../res/icons/048-bill.png`) },
//   {
//     name: "Entertainment",
//     image: require(`../../res/icons/062-laptop.png`),
//   },
//   {
//     name: "Shopping",
//     image: require(`../../res/icons/033-shopping-bags.png`),
//   },
//   { name: "Investing", image: require(`../../res/icons/049-trend.png`) },
//   {
//     name: "Rainy Day Savings",
//     image: require(`../../res/icons/051-insurance.png`),
//   },
//   {
//     name: "Gifts&Donations",
//     image: require(`../../res/icons/018-present-1.png`),
//   },
//   { name: "Savings", image: require(`../../res/icons/060-wallet.png`) },
//   {
//     name: "Commuting",
//     image: require(`../../res/icons/058-autonomous-car.png`),
//   },
//   {
//     name: "Services",
//     image: require(`../../res/icons/061-idea.png`),
//   },
//   {
//     name: "Other",
//     image: require(`../../res/icons/052-money-1.png`),
//   },
// ];
export const FREQUENCIES = {
  Weekly: "Weekly",
  Monthly: "Monthly",
  Quarterly: "Quarterly",
  Annually: "Annually",
};
// export const TEST = {
//   TestTransactions: false,
//   NordigenSandbox: false,
//   DeleteAllButton: false,
//   TestBill: false,
//   AlwaysShowIntro: false,
// };
// export const TRANSACTION_CATEGORIES = [
//   {
//     category: "medical",
//     image: require("../../res/icons/022-medical-checkup.png"),
//     words: ["dental", "medical", "care"],
//   },
//   {
//     category: "groceries",
//     image: require("../../res/icons/057-grocery.png"),
//     words: [
//       "lidl",
//       "co-op",
//       "tesco",
//       "slavyanski",
//       "morrison",
//       "aldi",
//       "wine stop",
//       "maxima",
//       "rimi",
//       "blackness news",
//       "best one",
//       "sainsburys",
//       "vynoteka",
//       "vilniaus alus",
//       "iki",
//       "lituanica",
//       "convenience",
//       "poundstretcher",
//     ],
//   },
//   {
//     category: "flowers",
//     image: require("../../res/icons/015-flower.png"),
//     words: ["olly bobbins", "rosebud"],
//   },
//   {
//     category: "bars",
//     image: require("../../res/icons/047-food-tray.png"),
//     words: [
//       "food",
//       "brasserie",
//       "gelateria",
//       "cafe",
//       "coffee",
//       "bar",
//       "maki ramen",
//       "pizza",
//       "mcdonald",
//       "flight club",
//       "alchemist",
//       "bella italia",
//       "raze",
//       "hesburger",
//       "ateik ateik",
//       "kavine",
//       "baras",
//       "restoranas",
//       "wolt",
//       "sushi",
//       "street foo",
//       "dukes corner",
//       "bistro",
//       "mabela",
//       "pret a manger",
//       "wasabi",
//       "deliveroo",
//       "pantry",
//       "lapop",
//       "subway",
//       "bennshank",
//       "soulfull",
//       "peacock",
//       "boat brae",
//     ],
//   },
//   {
//     category: "flights",
//     image: require("../../res/icons/024-traveling.png"),
//     words: ["ryanair", "wizzair", "jet2"],
//   },
//   {
//     category: "commuting",
//     image: require("../../res/icons/058-autonomous-car.png"),
//     words: [
//       "uber",
//       "trainline",
//       "coach",
//       "bus ",
//       "xplore",
//       "west mids",
//       "trains",
//       "neste",
//       "circle k",
//       "perkela",
//       "transport",
//       "viada",
//       "citybee",
//       "bolt",
//       "traukin",
//       "orlen",
//       "parkman",
//     ],
//   },
//   {
//     category: "savings",
//     image: require("../../res/icons/060-wallet.png"),
//     words: ["savings", "deposit"],
//   },
//   {
//     category: "exchange",
//     image: require("../../res/icons/055-cash-flow.png"),
//     words: ["exchange"],
//   },
//   {
//     category: "rent",
//     image: require("../../res/icons/045-rent.png"),
//     words: ["rent", "nuoma"],
//   },
//   {
//     category: "services",
//     image: require(`../../res/icons/061-idea.png`),
//     words: [
//       "google",
//       "patreon",
//       "klarna",
//       "amazon prime",
//       "plum",
//       "moneybox",
//       "voxi",
//       "railcard",
//       "fireship",
//       "crunchy roll",
//       "pildyk",
//     ],
//   },
//   {
//     category: "coffee",
//     image: require("../../res/icons/002-bubble-tea-1.png"),
//     words: ["starbucks", "cafe"],
//   },
//   {
//     category: "shopping",
//     image: require("../../res/icons/033-shopping-bags.png"),
//     words: [
//       "amznmktplace",
//       "asos",
//       "vapour",
//       "vapor",
//       "ebay",
//       "royalsmoke",
//       "cropp",
//       "vision express",
//       "prekyba",
//       "parduotuve",
//       "senukai",
//       "valhyr",
//       "skytech",
//       "perfume",
//       "rituals",
//       "cosmetics",
//     ],
//   },
//   {
//     category: "gaming",
//     image: require("../../res/icons/009-game-controller.png"),
//     words: ["steam"],
//   },
//   {
//     category: "ATM withdrawals",
//     image: require("../../res/icons/044-atm.png"),
//     words: ["cash", "atm"],
//   },
//   {
//     category: "transfers",
//     image: require("../../res/icons/053-payment.png"),
//     words: ["to "],
//   },
// ];
