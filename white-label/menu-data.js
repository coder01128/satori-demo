/* ================================================================
   MENU DATA — replace with your restaurant's menu.
   ----------------------------------------------------------------
   Structure:
     MENU_DATA.categories  → array of category objects
     category.id           → unique slug (used in CSS/JS lookups)
     category.name         → display name shown in tabs and headings
     category.items        → array of item objects
     item.id               → unique slug (also used as image filename:
                             assets/menu/<id>.jpg)
     item.name             → display name
     item.price            → number (no currency symbol)
     item.description      → short description shown on card and modal
   ================================================================ */

const MENU_DATA = {
  "categories": [
    {
      "id": "starters",
      "name": "Starters",
      "items": [
        {
          "id": "bruschetta",
          "name": "Bruschetta",
          "price": 65.00,
          "description": "Toasted ciabatta topped with fresh tomato, basil, garlic, and a drizzle of olive oil."
        },
        {
          "id": "calamari",
          "name": "Fried Calamari",
          "price": 95.00,
          "description": "Tender calamari lightly dusted and fried golden, served with aioli and lemon."
        },
        {
          "id": "soup-of-the-day",
          "name": "Soup of the Day",
          "price": 75.00,
          "description": "Ask your server for today's house-made soup, served with warm bread."
        }
      ]
    },
    {
      "id": "mains",
      "name": "Mains",
      "items": [
        {
          "id": "grilled-chicken",
          "name": "Grilled Chicken",
          "price": 175.00,
          "description": "Free-range chicken breast, herb marinade, roasted vegetables, and lemon butter sauce."
        },
        {
          "id": "beef-fillet",
          "name": "Beef Fillet",
          "price": 265.00,
          "description": "200 g prime beef fillet, cooked to your liking, with seasonal sides and jus."
        },
        {
          "id": "fish-of-the-day",
          "name": "Fish of the Day",
          "price": 195.00,
          "description": "Fresh catch of the day, pan-seared or grilled, with seasonal accompaniments."
        },
        {
          "id": "vegetarian-plate",
          "name": "Vegetarian Plate",
          "price": 145.00,
          "description": "Roasted seasonal vegetables, halloumi, hummus, and warm flatbread."
        }
      ]
    },
    {
      "id": "pasta",
      "name": "Pasta",
      "items": [
        {
          "id": "pasta-bolognese",
          "name": "Bolognese",
          "price": 155.00,
          "description": "Slow-cooked beef ragù in a rich tomato sauce, tossed with spaghetti and parmesan."
        },
        {
          "id": "pasta-carbonara",
          "name": "Carbonara",
          "price": 160.00,
          "description": "Crispy pancetta, egg yolk, parmesan, and black pepper — the Roman classic."
        },
        {
          "id": "pasta-pesto",
          "name": "Pesto Chicken Pasta",
          "price": 165.00,
          "description": "Grilled chicken strips tossed with basil pesto, cherry tomatoes, and penne."
        },
        {
          "id": "pasta-arrabiata",
          "name": "Arrabiata",
          "price": 140.00,
          "description": "Spicy tomato sauce with garlic, chilli, olives, and capers on rigatoni. Vegan."
        }
      ]
    },
    {
      "id": "pizza",
      "name": "Pizza",
      "items": [
        {
          "id": "pizza-margherita",
          "name": "Margherita",
          "price": 120.00,
          "description": "San Marzano tomato, fior di latte mozzarella, fresh basil, and extra-virgin olive oil."
        },
        {
          "id": "pizza-pepperoni",
          "name": "Pepperoni",
          "price": 145.00,
          "description": "Tomato base, mozzarella, and generous slices of spicy pepperoni salami."
        },
        {
          "id": "pizza-quattro-stagioni",
          "name": "Quattro Stagioni",
          "price": 155.00,
          "description": "Four sections: artichoke, ham, mushroom, and olives — one pizza, four seasons."
        },
        {
          "id": "pizza-white",
          "name": "White Pizza",
          "price": 150.00,
          "description": "No-tomato base with ricotta, mozzarella, spinach, garlic, and pine nuts."
        }
      ]
    },
    {
      "id": "desserts",
      "name": "Desserts",
      "items": [
        {
          "id": "tiramisu",
          "name": "Tiramisù",
          "price": 85.00,
          "description": "Classic Italian tiramisù — espresso-soaked savoiardi, mascarpone cream, and cocoa."
        },
        {
          "id": "panna-cotta",
          "name": "Panna Cotta",
          "price": 75.00,
          "description": "Silky vanilla panna cotta with a mixed berry compote."
        },
        {
          "id": "chocolate-fondant",
          "name": "Chocolate Fondant",
          "price": 95.00,
          "description": "Warm dark chocolate fondant with a molten centre, served with vanilla ice cream."
        }
      ]
    },
    {
      "id": "beverages",
      "name": "Beverages",
      "items": [
        {
          "id": "still-water",
          "name": "Still Water 500 ml",
          "price": 25.00,
          "description": "Chilled still mineral water."
        },
        {
          "id": "sparkling-water",
          "name": "Sparkling Water 500 ml",
          "price": 28.00,
          "description": "Chilled sparkling mineral water."
        },
        {
          "id": "soft-drink",
          "name": "Soft Drink",
          "price": 30.00,
          "description": "Coca-Cola, Sprite, Fanta Orange, or Appletiser — please specify in notes."
        },
        {
          "id": "fresh-juice",
          "name": "Fresh Juice",
          "price": 45.00,
          "description": "Freshly pressed orange or apple juice."
        }
      ]
    }
  ]
};
