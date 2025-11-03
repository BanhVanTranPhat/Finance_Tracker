import { categoryTemplates, defaultIncomeCategories } from "../data/categoryTemplates.js";

// Mapping from category ID to translation key
const categoryIdToTranslationKey = {
  rent: "categoryRent",
  bills: "categoryBills",
  food: "categoryFood",
  transportation: "categoryTransportation",
  children: "categoryChildren",
  pets: "categoryPets",
  debt: "categoryDebt",
  healthcare: "categoryHealthcare",
  insurance: "categoryInsurance",
  "car-maintenance": "categoryCarMaintenance",
  gifts: "categoryGifts",
  education: "categoryEducation",
  shopping: "categoryShopping",
  massage: "categoryMassage",
  spa: "categorySpa",
  "home-decoration": "categoryHomeDecoration",
  "short-trips": "categoryShortTrips",
  "buy-house": "categoryBuyHouse",
  "buy-car": "categoryBuyCar",
  "home-repair": "categoryHomeRepair",
  "equipment-upgrade": "categoryEquipmentUpgrade",
  housing: "categoryHousing",
  "daily-food": "categoryDailyFood",
  "mandatory-insurance": "categoryMandatoryInsurance",
  "basic-medicine": "categoryBasicMedicine",
  "dining-out": "categoryDiningOut",
  "shopping-entertainment": "categoryShoppingEntertainment",
  travel: "categoryTravel",
  "spa-massage": "categorySpaMassage",
  "personal-hobbies": "categoryPersonalHobbies",
  "emergency-fund": "categoryEmergencyFund",
  "long-term-investment": "categoryLongTermInvestment",
  "equipment-upgrade-short": "categoryEquipmentUpgradeShort",
  "self-development": "categorySelfDevelopment",
};

// Mapping from group ID to translation key
const groupIdToTranslationKey = {
  mandatory: "groupMandatoryExpenses",
  irregular: "groupIrregularExpenses",
  joy: "groupMyJoys",
  "long-term-investment": "groupLongTermInvestment",
  needs: "groupEssentialNeeds",
  wants: "groupWants",
  "savings-investment": "groupSavingsInvestment",
};

// Mapping from income category ID to translation key
const incomeCategoryIdToTranslationKey = {
  salary: "incomeSalary",
  bonus: "incomeBonus",
  investment: "incomeInvestment",
  "other-income": "incomeOther",
};

export const getLocalizedCategoryTemplates = (t) => {
  return categoryTemplates.map((template) => {
    let translatedName = template.name;
    let translatedDescription = template.description;

    // Translate template names and descriptions
    if (template.id === "finance-tracker-style") {
      translatedName = t("template1FinanceTracker");
      translatedDescription = t("template1Description");
    } else if (template.id === "50-30-20") {
      translatedName = t("template2_50_30_20");
      translatedDescription = t("template2Description");
    }

    // Translate groups and categories
    const translatedGroups = template.groups.map((group) => {
      const groupTranslationKey = groupIdToTranslationKey[group.id];
      const translatedGroupName = groupTranslationKey
        ? t(groupTranslationKey)
        : group.name;

      const translatedCategories = group.categories.map((category) => {
        const categoryTranslationKey = categoryIdToTranslationKey[category.id];
        const translatedCategoryName = categoryTranslationKey
          ? t(categoryTranslationKey)
          : category.name;

        return {
          ...category,
          name: translatedCategoryName,
        };
      });

      return {
        ...group,
        name: translatedGroupName,
        categories: translatedCategories,
      };
    });

    return {
      ...template,
      name: translatedName,
      description: translatedDescription,
      groups: translatedGroups,
    };
  });
};

export const getLocalizedIncomeCategories = (t) => {
  return defaultIncomeCategories.map((category) => {
    const translationKey = incomeCategoryIdToTranslationKey[category.id];
    const translatedName = translationKey ? t(translationKey) : category.name;

    return {
      ...category,
      name: translatedName,
    };
  });
};

