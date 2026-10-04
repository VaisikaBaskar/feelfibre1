const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Dynamic route loader - maps camelCase to kebab-case
const routesPath = path.join(__dirname, 'routes');
if (fs.existsSync(routesPath)) {
    fs.readdirSync(routesPath).forEach(file => {
        if (file.endsWith('.js')) {
            const fileName = file.replace('.js', '');
            const routePath = fileName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            
            try {
                const routeModule = require(`./routes/${file}`);
                // Express middleware/routers are functions
                if (typeof routeModule === 'function') {
                    if (fileName === "products") {
                        app.use(`/api`, routeModule);
                    } else {
                        app.use(`/api/${routePath}`, routeModule);
                    }
                } else {
                    console.warn(`Skipping ${file}: module does not export a valid router function.`);
                }
            } catch (err) {
                console.error(`Error loading route module ${file}:`, err.message);
            }
        }
    });
} else {
    console.warn("No routes directory found");
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
