let priceData = null;

async function loadPriceData() {
    try {
        const response = await fetch('data/price.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        priceData = await response.json();
        initCalculator();
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

function initCalculator() {
    if (!priceData) {
        console.error('Данные не загружены');
        return;
    }

    const brandSelect = document.getElementById('brand');
    const modelSelect = document.getElementById('model');

    priceData.brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.name;
        option.textContent = brand.name;
        brandSelect.appendChild(option);
    });

    brandSelect.addEventListener('change', (e) => {
        const selectedBrand = e.target.value;
        updateModels(selectedBrand);
        clearRepairCards();
    });

    modelSelect.addEventListener('change', (e) => {
        const selectedBrand = brandSelect.value;
        const selectedModel = e.target.value;
        if (selectedBrand && selectedModel) {
            updateRepairCards(selectedBrand, selectedModel);
        }
    });
}

function updateModels(brandName) {
    const modelSelect = document.getElementById('model');
    modelSelect.innerHTML = '<option value="">-- Выберите модель --</option>';
    
    if (!brandName) {
        modelSelect.disabled = true;
        modelSelect.innerHTML = '<option value="">-- Сначала выберите бренд --</option>';
        return;
    }

    const brand = priceData.brands.find(b => b.name === brandName);
    if (brand && brand.models.length > 0) {
        modelSelect.disabled = false;
        brand.models.forEach(model => {
            const option = document.createElement('option');
            option.value = model.name;
            option.textContent = model.name;
            modelSelect.appendChild(option);
        });
    }
}

function updateRepairCards(brandName, modelName) {
    const brand = priceData.brands.find(b => b.name === brandName);
    const model = brand.models.find(m => m.name === modelName);

    if (!model || !model.repairs) return;

    const repairGrid = document.getElementById('repairGrid');
    repairGrid.innerHTML = '';

    priceData.repairTypes.forEach(repairType => {
        const price = model.repairs[repairType.key];
        if (price) {
            const card = document.createElement('div');
            card.className = 'repair-card';
            card.innerHTML = `
                <h4>${repairType.name}</h4>
                <p class="price">${price}₽</p>
            `;
            repairGrid.appendChild(card);
        }
    });
}

function clearRepairCards() {
    const repairGrid = document.getElementById('repairGrid');
    repairGrid.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', loadPriceData);
