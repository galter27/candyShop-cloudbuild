function changeCurrency() {
    const selectedCurrency = document.getElementById('currency-selector').value;
    fetch('/products/setCurrency', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ currency: selectedCurrency })
    }).then(response => window.location.reload());
  }
