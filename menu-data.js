/* menu-data.js — Satori menu as a JS constant (works with file://)  */
const MENU_DATA = {
  "categories": [
    {
      "id": "starters-salads",
      "name": "Starters & Salads",
      "items": [
        { "id": "caprese",          "name": "Caprese",           "price": 139.00, "description": "Fresh mozzarella, tomato, lettuce, basil, and olives for a classic, refreshing starter." },
        { "id": "halloumi-starter", "name": "Halloumi Starter",  "price": 149.00, "description": "Halloumi cheese paired with avocado, olives, fresh basil, and ripe tomato for a delightful starter." },
        { "id": "satori-favourite", "name": "Satori Favourite",  "price": 165.00, "description": "Greek or Italian salad with fresh basil, avocado, and tangy peppadews." },
        { "id": "zorba-the-greek",  "name": "Zorba The Greek",   "price": 169.00, "description": "Crisp lettuce, juicy tomato, onion, blue cheese, and bacon for a refreshing start." },
        { "id": "avocado-ritz",     "name": "Avocado Ritz",      "price": 95.00,  "description": "Half an avocado filled with prawn cocktail." },
        { "id": "fegatini-di-pollo","name": "Fegatini di Pollo", "price": 140.00, "description": "Spicy chicken livers served on a warm focaccia, offering a delightful blend of flavors." },
        { "id": "italian-salad",    "name": "Italian Salad",     "price": 149.00, "description": "Crisp lettuce, juicy tomato, onion, olives, and mozzarella cheese for a refreshing start." },
        { "id": "greco-salad",      "name": "Greco Salad",       "price": 145.00, "description": "Crisp lettuce, juicy tomatoes, onions, olives, and creamy feta cheese for a refreshing start." },
        { "id": "garlic-snails",    "name": "Garlic Snails",     "price": 130.00, "description": "Delicate snails bathed in a rich garlic butter sauce, perfect for a savory start to your meal." },
        { "id": "bouboulina",       "name": "Bouboulina",        "price": 160.00, "description": "Greco salad served on a medium focaccia bread, offering a delightful blend of flavors and textures." },
        { "id": "zorba-the-buddha", "name": "Zorba the Buddha",  "price": 169.00, "description": "Lettuce, tomato, anchovies, capers, basil pesto, and mozzarella cheese in a refreshing salad." },
        { "id": "insalata-di-pollo","name": "Insalata di Pollo", "price": 159.00, "description": "Lettuce, tomato, green pepper, and onion topped with savory chicken strips." }
      ]
    },
    {
      "id": "pasta",
      "name": "Pasta",
      "items": [
        { "id": "pollo-pesto-pasta",      "name": "Pollo Pesto Pasta",      "price": 175.00, "description": "Tender chicken strips in a creamy basil pesto sauce, perfect for pasta lovers." },
        { "id": "bolognaise",             "name": "Bolognaise",             "price": 220.00, "description": "Lean mince enveloped in rich napolitana sauce for a classic pasta delight." },
        { "id": "alfredo-pasta",          "name": "Alfredo Pasta",          "price": 215.00, "description": "Ham and mushroom enveloped in a rich, creamy sauce." },
        { "id": "carbonara-pasta",        "name": "Carbonara Pasta",        "price": 169.00, "description": "Bacon and parmesan in a creamy egg sauce, creating a rich and savory pasta delight." },
        { "id": "corleone-pasta",         "name": "Corleone Pasta",         "price": 189.00, "description": "Bacon, olives, chillies, and garlic in napolitana sauce." },
        { "id": "napolitana-pasta",       "name": "Napolitana Pasta",       "price": 150.00, "description": "Tomato-rich pasta with olives and herbs for a classic Italian taste." },
        { "id": "venice-pasta",           "name": "Venice Pasta",           "price": 179.00, "description": "Chicken, bacon, peas, and mushrooms enveloped in a rich, creamy parmesan sauce." },
        { "id": "chourico-pasta",         "name": "Chouriço Pasta",         "price": 179.00, "description": "Portuguese chouriço in a rich napolitana sauce for a savory pasta delight." },
        { "id": "thearti-pasta",          "name": "Thearti Pasta",          "price": 160.00, "description": "Sundried tomatoes, basil, and olive oil tossed with pesto for a fresh, vibrant flavor." },
        { "id": "beef-fillet-pesto-pasta","name": "Beef Fillet Pesto Pasta","price": 185.00, "description": "Beef fillet with creamy pesto sauce, tossed with pasta and finished with parmesan cheese." },
        { "id": "donna-pasta",            "name": "Donna Pasta",            "price": 179.00, "description": "Chicken strips with sundried tomato, fresh basil, and a rich pesto sauce." },
        { "id": "capri-pasta",            "name": "Capri Pasta",            "price": 185.00, "description": "Tender veal strips and mushrooms in a rich, creamy sauce." },
        { "id": "fegati-pasta",           "name": "Fegati Pasta",           "price": 175.00, "description": "Chicken livers with garlic, chili, and green pepper in a creamy Napolitana sauce." }
      ]
    },
    {
      "id": "baked-pasta",
      "name": "Baked Pasta",
      "items": [
        { "id": "ravioli",        "name": "Ravioli",        "price": 175.00, "description": "Traditional beef mince in pasta served in a creamy napolitana sauce." },
        { "id": "lasagne",        "name": "Lasagne",        "price": 179.00, "description": "Traditional beef lasagne, baked to perfection. Please allow 25 minutes for baking." },
        { "id": "panzerrotti",    "name": "Panzerrotti",    "price": 175.00, "description": "Half-moon pasta filled with butternut or spinach and ricotta, served in creamy napolitana sauce." },
        { "id": "farfalle-satori","name": "Farfalle Satori","price": 179.00, "description": "Farfalle pasta in creamy gorgonzola and parmesan sauce, with bacon and fresh spinach." }
      ]
    },
    {
      "id": "classic-pizzas",
      "name": "Classic Pizzas",
      "items": [
        { "id": "focaccia-pizza",       "name": "Focaccia Pizza",       "price": 75.00,  "description": "Herb-infused pizza base topped with aromatic garlic for a classic, savory delight." },
        { "id": "cheese-focaccia-pizza","name": "Cheese Focaccia Pizza","price": 80.00,  "description": "Herb-infused pizza base with melted cheese." },
        { "id": "margherita-pizza",     "name": "Margherita Pizza",     "price": 135.00, "description": "Tomato base topped with mozzarella and oregano for a classic, savory delight." },
        { "id": "alyson-pizza",         "name": "Alyson Pizza",         "price": 145.00, "description": "Focaccio base with feta, basil, peppadew, and avocado." },
        { "id": "quattro-pizza",        "name": "Quattro Pizza",        "price": 145.00, "description": "Salami, ham, mushroom, and green pepper." },
        { "id": "bolognaise-pizza",     "name": "Bolognaise Pizza",     "price": 145.00, "description": "Rich bolognaise sauce layered on a classic Margherita pizza base." },
        { "id": "trio-pizza",           "name": "Trio Pizza",           "price": 150.00, "description": "A cheesy delight with mozzarella, cheddar, and feta, offering a trio of flavors in every bite." },
        { "id": "capone",               "name": "Capone",               "price": 155.00, "description": "Bacon, mushroom, chourico and chilli." },
        { "id": "mexicana-pizza",       "name": "Mexicana Pizza",       "price": 160.00, "description": "Mince, chili, onion, and green pepper on a classic pizza base for a spicy delight." },
        { "id": "vegetarian-pizza",     "name": "Vegetarian Pizza",     "price": 160.00, "description": "Mushrooms, green peppers, olives, onions, and artichokes on a classic vegetarian pizza." },
        { "id": "georgio-pizza",        "name": "Georgio Pizza",        "price": 160.00, "description": "Artichokes, ham, mushrooms, and olives on a classic pizza base for a savory delight." },
        { "id": "nicoletta-pizza",      "name": "Nicoletta Pizza",      "price": 165.00, "description": "Bacon, avocado, and feta combine for a savory and creamy pizza delight." },
        { "id": "regina-pizza",         "name": "Regina Pizza",         "price": 199.00, "description": "Savory pizza topped with ham and mushrooms for a classic taste." },
        { "id": "hawaiian-pizza",       "name": "Hawaiian Pizza",       "price": 199.00, "description": "Savory ham paired with sweet pineapple on a classic pizza base for a delightful taste experience." },
        { "id": "spare-rib-pizza",      "name": "Spare Rib Pizza",      "price": 215.00, "description": "Margerita pizza topped with marinated spare rib meat for a savory delight." }
      ]
    },
    {
      "id": "gourmet-pizzas",
      "name": "Gourmet Pizzas",
      "items": [
        { "id": "toto",          "name": "Toto",          "price": 149.00, "description": "Salami, pear, and blue cheese combine for a unique and savory gourmet pizza experience." },
        { "id": "beira",         "name": "Beira",         "price": 155.00, "description": "Salami, olives, and feta combine for a savory delight." },
        { "id": "plata",         "name": "Plata",         "price": 155.00, "description": "Bacon, sundried tomato, halloumi, and olives." },
        { "id": "4th-ave-pizza", "name": "4th Ave Pizza", "price": 155.00, "description": "Margerita base with balsamic glazed sirloin slices and rocket." },
        { "id": "pandas-special","name": "Pandas Special","price": 160.00, "description": "Focaccia with feta, blue cheese, capers, rocket, avocado, and balsamic caramelized onions." },
        { "id": "mona-lisa",     "name": "Mona Lisa",     "price": 160.00, "description": "Salami, ham, mushrooms, pineapple, and garlic come together for a savory and sweet pizza delight." },
        { "id": "leonardo",      "name": "Leonardo",      "price": 160.00, "description": "Sundried tomatoes, artichokes, mushrooms, and olives on a gourmet pizza." },
        { "id": "tuscan",        "name": "Tuscan",        "price": 165.00, "description": "Bacon, feta, chouriço, olives, and peppadews create a savory and tangy flavor combination." },
        { "id": "mamma-mia",     "name": "Mamma Mia",     "price": 165.00, "description": "Salami, peppadew, feta, avocado, and tomato come together for a delightful gourmet pizza experience." },
        { "id": "carnivore",     "name": "Carnivore",     "price": 165.00, "description": "A savory blend of ham, salami, and bacon for a meat lover's delight." },
        { "id": "gambini",       "name": "Gambini",       "price": 165.00, "description": "Chicken, bacon, peppadews, and avocado combine for a savory and tangy delight." },
        { "id": "mediterranean", "name": "Mediterranean", "price": 165.00, "description": "Chouriço, feta, artichokes, olives, peppadew, and sundried tomato on a gourmet pizza." },
        { "id": "lloyd-special", "name": "Lloyd Special", "price": 165.00, "description": "Chicken, chili, onion, and avocado come together for a zesty and fresh flavor combination." },
        { "id": "satori-special","name": "Satori Special","price": 175.00, "description": "Mushrooms, artichokes, salami, ham, olives, halloumi, and green pepper on a gourmet pizza." },
        { "id": "four-seasons",  "name": "Four Seasons",  "price": 175.00, "description": "Quarter Hawaiian, Nicoletta, Regina, and Mexicana pizza slices in one delightful combination." }
      ]
    },
    {
      "id": "beverages",
      "name": "Beverages",
      "items": [
        { "id": "soft-drinks",      "name": "Soft Drinks",      "price": 32.00, "description": "Coke, Coke Light, Sprite, Fanta. Can." },
        { "id": "tiser",            "name": "Tiser",            "price": 40.00, "description": "Appletiser." },
        { "id": "water",            "name": "Still Water",      "price": 30.00, "description": "Still mineral water." },
        { "id": "200ml-lemonade",   "name": "200ml Lemonade",   "price": 25.00, "description": "200ml Lemonade." },
        { "id": "200ml-dry-lemon",  "name": "200ml Dry Lemon",  "price": 25.00, "description": "200ml Dry Lemon." },
        { "id": "200ml-ginger-ale", "name": "200ml Ginger Ale", "price": 25.00, "description": "200ml Ginger Ale." },
        { "id": "200ml-soda-water", "name": "200ml Soda Water", "price": 25.00, "description": "200ml Soda Water." }
      ]
    },
    {
      "id": "family-combos",
      "name": "Family Combos",
      "items": [
        { "id": "family-bolognaise-combo","name": "Family Bolognaise Combo","price": 450.00, "description": "4 Spaghetti Bolognaise and a Large Garlic Foccacio." },
        { "id": "combo-pizza-deal",       "name": "Combo Pizza Deal",       "price": 600.00, "description": "Enjoy a variety of large pizzas: Regina, Hawaiian, Margherita, and La Nona." },
        { "id": "combo-lasagne-deal",     "name": "Combo Lasagne Deal",     "price": 560.00, "description": "Beef lasagne for 4–6 with a refreshing Greek salad on the side." }
      ]
    }
  ]
};
