document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.btn');
    const clearBtn = document.getElementById('clear');
    const calculateBtn = document.getElementById('calculate');
    const errorMsg = document.getElementById('error-message');

    let currentInput = '';
    let previousInput = '';
    let operator = null;

    buttons.forEach(button => {
        if (button.id !== 'clear' && button.id !== 'calculate') {
            button.addEventListener('click', () => {
                const value = button.getAttribute('data-value');
                
                if (button.classList.contains('operator')) {
                    if (currentInput === '') return;
                    operator = value;
                    previousInput = currentInput;
                    currentInput = '';
                } else {
                    currentInput += value;
                }
                
                updateDisplay();
                errorMsg.textContent = '';
            });
        }
    });

    clearBtn.addEventListener('click', () => {
        currentInput = '';
        previousInput = '';
        operator = null;
        updateDisplay();
        errorMsg.textContent = '';
    });

    calculateBtn.addEventListener('click', async () => {
        if (previousInput === '' || currentInput === '' || operator === null) return;

        try {
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    num1: previousInput,
                    num2: currentInput,
                    operator: operator
                })
            });

            const data = await response.json();

            if (response.ok) {
                currentInput = data.result.toString();
                previousInput = '';
                operator = null;
                updateDisplay();
            } else {
                errorMsg.textContent = data.error || 'An error occurred';
            }
        } catch (error) {
            errorMsg.textContent = 'Failed to connect to server';
        }
    });

    function updateDisplay() {
        if (operator && currentInput === '') {
            display.value = previousInput + ' ' + operator;
        } else if (operator) {
            display.value = previousInput + ' ' + operator + ' ' + currentInput;
        } else {
             display.value = currentInput || '0';
        }
    }
});
