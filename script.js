// Elementos do DOM
const inputNumber = document.getElementById('input-number');
const conversionTypeRadios = document.querySelectorAll('input[name="conversion-type"]');
const convertBtn = document.getElementById('convert-btn');
const resultDiv = document.getElementById('result');
const showStepsBtn = document.getElementById('show-steps-btn');
const stepsModal = document.getElementById('steps-modal');
const closeModal = document.getElementById('close-modal');
const stepsContainer = document.getElementById('steps-container');

// Converter as etapas em array
let conversionSteps = [];

// Listando os eventos
convertBtn.addEventListener('click', performConversion);
showStepsBtn.addEventListener('click', showSteps);
closeModal.addEventListener('click', () => {
    stepsModal.classList.remove('active');
});

// Fechar o modal ao clicar fora
stepsModal.addEventListener('click', (e) => {
    if (e.target === stepsModal) {
        stepsModal.classList.remove('active');
    }
});

function getConversionType() {
    let selectedType;
    conversionTypeRadios.forEach((radio) => {
        if (radio.checked) {
            selectedType = radio.value;
        }
    });
    return selectedType;
}

function performConversion() {
    const number = inputNumber.value.trim();
    const conversionType = getConversionType();

    // Reseta as etapas
    conversionSteps = [];

    // Valida os inputs
    if (!number) {
        resultDiv.textContent = 'Por favor, digite um número';
        showStepsBtn.style.display = 'none';
        return;
    }

    let result;

    try {
        if (conversionType === 'decimal-to-binary') {
            // Valida o input decimal
            if (!/^-?\d+(\.\d+)?$/.test(number)) {
                throw new Error('Formato decimal inválido. Use um número como 42 ou 42.75');
            }
            result = decimalToBinary(number);
        } else {
            // Valida o input binário
            if (!/^[01]+(\.[01]+)?$/.test(number)) {
                throw new Error('Formato binário inválido. Use apenas 0 e 1, como 101 ou 101.11');
            }
            result = binaryToDecimal(number);
        }

        resultDiv.textContent = result;
        showStepsBtn.style.display = 'block';
    } catch (error) {
        resultDiv.textContent = error.message;
        showStepsBtn.style.display = 'none';
    }
}

function decimalToBinary(decimalStr) {
    // Lida com os números negativos
    let isNegative = false;
    if (decimalStr.startsWith('-')) {
        isNegative = true;
        decimalStr = decimalStr.substring(1);
    }

    // Separa inteiros e fracionados
    const parts = decimalStr.split('.');
    const integerPart = parseInt(parts[0]);

    conversionSteps.push({
        step: 'Separação das partes',
        explanation: `Separamos o número ${decimalStr} em parte inteira (${parts[0]}) e parte fracionária ${
            parts[1] ? '0.' + parts[1] : 'nenhuma'
        }`
    });

    // Converte a parte inteira
    const integerBinary = integerToBinary(integerPart);

    // Se houver uma parte fracionada, converte ela
    let fractionalBinary = '';
    if (parts.length > 1 && parts[1] !== '') {
        fractionalBinary = fractionalToBinary('0.' + parts[1]);
    }

    // Combina os resultados
    let result = integerBinary;
    if (fractionalBinary) {
        result += '.' + fractionalBinary;
    }

    conversionSteps.push({
        step: 'Resultado final',
        explanation: `O número decimal ${decimalStr} em binário é ${isNegative ? '-' : ''}${result}`
    });

    return isNegative ? '-' + result : result;
}

function integerToBinary(integer) {
    if (integer === 0) {
        conversionSteps.push({
            step: 'Conversão da parte inteira',
            explanation: '0 em decimal é 0 em binário'
        });
        return '0';
    }

    let binary = '';
    let num = integer;
    let stepDetails = [];

    while (num > 0) {
        const remainder = num % 2;
        binary = remainder + binary;
        stepDetails.push(`${num} ÷ 2 = ${Math.floor(num / 2)} com resto ${remainder}`);
        num = Math.floor(num / 2);
    }

    conversionSteps.push({
        step: 'Conversão da parte inteira',
        explanation: `Dividimos o número ${integer} sucessivamente por 2 e anotamos os restos:\n${stepDetails.join(
            '\n'
        )}\nOs restos lidos de baixo para cima formam o número binário: ${binary}`
    });

    return binary;
}

function fractionalToBinary(fraction) {
    let binary = '';
    let fractionalPart = parseFloat(fraction);
    let iterations = 0;
    const MAX_ITERATIONS = 10; // Limite de 10 casas
    let stepDetails = [];

    while (fractionalPart > 0 && iterations < MAX_ITERATIONS) {
        fractionalPart *= 2;
        const digit = Math.floor(fractionalPart);
        binary += digit;

        stepDetails.push(`${fractionalPart - digit} × 2 = ${fractionalPart} → dígito: ${digit}`);

        if (fractionalPart >= 1) {
            fractionalPart -= 1;
        }
        iterations++;
    }

    conversionSteps.push({
        step: 'Conversão da parte fracionária',
        explanation: `Multiplicamos a parte fracionária ${fraction} sucessivamente por 2 e anotamos a parte inteira do resultado:\n${stepDetails.join(
            '\n'
        )}\nOs dígitos inteiros formam a parte fracionária binária: ${binary}`
    });

    return binary;
}

function binaryToDecimal(binaryStr) {
    // Lida com números negativos
    let isNegative = false;
    if (binaryStr.startsWith('-')) {
        isNegative = true;
        binaryStr = binaryStr.substring(1);
    }

    // Separa partes inteiras e fracionadas
    const parts = binaryStr.split('.');
    const integerPart = parts[0];

    conversionSteps.push({
        step: 'Separação das partes',
        explanation: `Separamos o número binário ${binaryStr} em parte inteira (${parts[0]}) e parte fracionária ${
            parts[1] ? '0.' + parts[1] : 'nenhuma'
        }`
    });

    // Converte a parte interira
    const integerDecimal = binaryIntegerToDecimal(integerPart);

    // Se houver uma parte fracionada, converte ela
    let fractionalDecimal = 0;
    if (parts.length > 1 && parts[1] !== '') {
        fractionalDecimal = binaryFractionalToDecimal(parts[1]);
    }

    // Combina os resultados
    const result = integerDecimal + fractionalDecimal;
    const formattedResult = formatDecimalResult(result);

    conversionSteps.push({
        step: 'Resultado final',
        explanation: `O número binário ${binaryStr} em decimal é ${isNegative ? '-' : ''}${formattedResult}`
    });

    return isNegative ? '-' + formattedResult : formattedResult;
}

function binaryIntegerToDecimal(binary) {
    let decimal = 0;
    let stepDetails = [];

    for (let i = 0; i < binary.length; i++) {
        const digit = parseInt(binary[i]);
        const position = binary.length - 1 - i;
        const value = digit * Math.pow(2, position);
        decimal += value;

        if (digit === 1) {
            stepDetails.push(`2^${position} = ${Math.pow(2, position)}`);
        }
    }

    conversionSteps.push({
        step: 'Conversão da parte inteira',
        explanation: `Para cada dígito 1 na parte inteira, calculamos a potência de 2 correspondente à sua posição:\n${stepDetails.join(
            '\n'
        )}\nSomando todos esses valores: ${decimal}`
    });

    return decimal;
}

function binaryFractionalToDecimal(binary) {
    let decimal = 0;
    let stepDetails = [];

    for (let i = 0; i < binary.length; i++) {
        const digit = parseInt(binary[i]);
        const position = -(i + 1);
        const value = digit * Math.pow(2, position);
        decimal += value;

        if (digit === 1) {
            stepDetails.push(`2^(${position}) = ${Math.pow(2, position)}`);
        }
    }

    conversionSteps.push({
        step: 'Conversão da parte fracionária',
        explanation: `Para cada dígito 1 na parte fracionária, calculamos a potência negativa de 2 correspondente:\n${stepDetails.join(
            '\n'
        )}\nSomando todos esses valores: ${decimal}`
    });

    return decimal;
}

function formatDecimalResult(number) {
    // Converte em string para lidar com os problemas
    const str = number.toString();

    // Se for um número inteiro ou muito próximo, retorna como inteiro
    if (Math.abs(number - Math.round(number)) < 1e-10) {
        return Math.round(number).toString();
    }

    // Caso contrário, retorna com 10 casas decimais
    return number.toFixed(10).replace(/\.?0+$/, '');
}

function showSteps() {
    // Limpa as etapas anteriormente exibidas
    stepsContainer.innerHTML = '';

    // Adiciona as etapas ao modal
    conversionSteps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'step';

        const stepTitle = document.createElement('div');
        stepTitle.innerHTML = `<span class="step-number">Passo ${index + 1}:</span> ${step.step}`;

        const stepExplanation = document.createElement('div');
        stepExplanation.className = 'step-explanation';
        stepExplanation.textContent = step.explanation;

        stepElement.appendChild(stepTitle);
        stepElement.appendChild(stepExplanation);
        stepsContainer.appendChild(stepElement);
    });

    // Exibe o modal
    stepsModal.classList.add('active');
}
