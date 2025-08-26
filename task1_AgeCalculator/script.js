const selects = document.querySelectorAll(".custom-select");

selects.forEach(sel => {
  const input = sel.querySelector("input");
  const itemsDiv = sel.querySelector(".custom-select-items");
  const arrow = sel.querySelector(".arrow");
  const type = sel.dataset.type;

  let start, end;
  if(type==="day"){ start=1; end=31; }
  if(type==="month"){ start=1; end=12; }
  if(type==="year"){ start=1900; end=new Date().getFullYear(); }

  for(let i=(type==="year"?end:start); (type!=="year"?i<=end:i>=start); (type!=="year"?i++:i--)){
    const div = document.createElement("div");
    div.textContent = i;
    div.addEventListener("click", () => {
      input.value = i;
      itemsDiv.style.display = "none";
    });
    itemsDiv.appendChild(div);
  }

  arrow.addEventListener("click", e => {
    e.stopPropagation();
    itemsDiv.style.display = itemsDiv.style.display==="block"?"none":"block";
    input.focus();
  });

  sel.addEventListener("click", e => {
    if(e.target !== input && e.target !== arrow){
      itemsDiv.style.display = itemsDiv.style.display==="block"?"none":"block";
    }
  });

  input.addEventListener("keydown", e => {
    if(e.key === "Enter"){
      e.preventDefault();
      const val = parseInt(input.value);
      if(isNaN(val) || val < start || val > end){
        alert(`Invalid ${type} value!`);
        input.focus();
        return;
      }
      itemsDiv.style.display = "none";
      const nextInput = sel.parentElement.nextElementSibling?.querySelector("input");
      if(nextInput) nextInput.focus();
      else calculateAge();
    }
  });
});

document.addEventListener("click", e => {
  selects.forEach(sel => sel.querySelector(".custom-select-items").style.display = "none");
});

function calculateAge(){
  const day = parseInt(document.querySelector(".custom-select[data-type='day'] input").value);
  const month = parseInt(document.querySelector(".custom-select[data-type='month'] input").value) - 1;
  const year = parseInt(document.querySelector(".custom-select[data-type='year'] input").value);

  const resultDiv = document.getElementById("result");

  if(isNaN(day) || isNaN(month) || isNaN(year)){
    resultDiv.textContent = "⚠️ Please enter a valid date!";
    resultDiv.classList.add("error");
    return;
  }

  const today = new Date();
  const birthDate = new Date(year, month, day);

  if(birthDate > today){
    resultDiv.textContent = "⚠️ Date of birth cannot be in the future!";
    resultDiv.classList.add("error");
    return;
  }

  let ageYears = today.getFullYear() - birthDate.getFullYear();
  let ageMonths = today.getMonth() - birthDate.getMonth();
  let ageDays = today.getDate() - birthDate.getDate();

  if(ageDays < 0){
    ageMonths--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    ageDays += prevMonth.getDate();
  }
  if(ageMonths < 0){
    ageYears--;
    ageMonths += 12;
  }

  resultDiv.classList.remove("error");
  resultDiv.textContent = `🎉 You are ${ageYears} years, ${ageMonths} months, and ${ageDays} days old.`;

  document.querySelectorAll(".custom-select input").forEach(inp => inp.value = "");
}

document.getElementById("ageForm").addEventListener("submit", e => {
  e.preventDefault();
  calculateAge();
});
