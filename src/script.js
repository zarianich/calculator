const { useState, useContext, useEffect, createContext } = React;

const Context = createContext(null);

const App = () => {
  const [ expr, setExpr ] = useState("0");
  const [ numberFlag, setNumberFlag ] = useState(false);
  
  const handleClick = (e) => {
    const btn = e.target;
    
    switch (btn.id) {
      case 'clear':
        setExpr("0");
        setNumberFlag(prev => false);
        break;
      case 'equals':
        setExpr(calculateExpr);
        break;
      case 'clear-last':
        setExpr(prev => {
          if (prev === 'Invalid input') {
            return '0';
          } else if (prev.length === 1) {
            return '0';
          } else {
            return prev.slice(0, prev.length - 1);
          }
        });
        break;
      default:
        setExpr(prev => {
          if (prev.length >= 20) {
            alert('Maximum length');
            return prev;
          } else {
            const input = btn.innerText;
            
            
            
            if (prev === '0' || prev === 'Invalid input') {
              if (input === '.') {
                setNumberFlag(true);
                return '0.';
              }
              return input;
            } else {
              
              if ((/\d/).test(input)) {
                if (prev.length > 0) {
                  if ((/[-+\/x]/).test(prev[prev.length - 1])) {
                    setNumberFlag(false);
                  }
                }
                return prev + input;
              } else if ((/[+\/x]/).test(input)) {
                if (prev.length > 0) {
                  if (prev.length > 2) {
                    if ((/[+\/x]/).test(prev[prev.length - 2]) && (/[-+\/x]/).test(prev[prev.length - 1])) {
                      return prev.substring(0, prev.length - 2) + input;
                    }//3 + 5 * 6 - 2 / 4
                  }
                  if ((/[-+\/x]/).test(prev[prev.length - 1])) {
                    return prev.substring(0, prev.length - 1) + input;
                  }
                }
                return prev + input;
              } else if (input === '.') {
                if (numberFlag) {
                  return prev;
                } else {
                  setNumberFlag(true);
                  return prev + input;
                }
              } else if (input === '-') {
                if (prev.length > 1) {
                  if ((/[-+\/x\\.]/).test(prev[prev.length - 2]) && (/\d/).test(prev[prev.length - 1])) {
                    
                    return prev + input;
                  } else if ((/[-+\/x]/).test(prev[prev.length - 1]) && (/\d/).test(prev[prev.length - 2])) {
                    return prev + input;
                  }
                  else {
                    return prev;
                  }
                } else {
                  if (prev[prev.length - 1] === '-') {
                    return prev;
                  } else {
                    return prev + input;
                  }
                }
              }
            }
          }
        });
    }
  }
  
  useEffect(() => {
    Context.Provider.handleClick = handleClick;
  }, [numberFlag]);
  
  const calculateExpr = () => {
    
    const numRegex = /(^-|(?<=\d[+-\/x])-)?\d+(\.\d+)?/g;
    const operRegex = /[+-\/x]/g;
    
    let nums = expr.match(numRegex).map(el => Number(el));
    let ops = expr.replace(numRegex, "").match(operRegex) || [];
    console.log(nums, ops);
    
    if (ops.length >= nums.length) {
      return 'Invalid input';
    } else {
      
      const getIndex = op => {
        return ops.indexOf(op);
      }
      
      const adjustArrs = (index, value) => {
        nums.splice(index, 2, value);
        ops.splice(index, 1);
        console.log(nums, ops);
      }
      
      // calculate multiplication
      if (ops.includes('x')) {
        while (ops.includes('x')) {
          const index = getIndex('x');
          let temp = nums[index] * nums[index + 1];
          adjustArrs(index, temp);
        }
      } 
      
      // calculate division
      if (ops.includes('/')) {
        const isDecimal = num => {
          return num % 1 !== 0;
        }
        while (ops.includes('/')) {
          const index = getIndex('/');
          let temp = nums[index] / nums[index + 1];
          if (isDecimal(temp)) {
            temp = Number(temp.toFixed(4));
          }
          adjustArrs(index, temp);
        }
      }
      
      //calculate subtraction
      if (ops.includes('-')) {
        while (ops.includes('-')) {
          const index = getIndex('-');
          let temp = nums[index] - nums[index + 1];
          adjustArrs(index, temp);
        }
      }
      
      // calculate addition
      if (ops.includes('+')) {
        while (ops.includes('+')) {
          const index = getIndex('+');
          let temp = nums[index] + nums[index + 1];
          adjustArrs(index, temp);
        }
      }
     
    }
    return nums[0].toString();
  }
  
  return (
    <Context.Provider value={{
        handleClick
      }}>
      <div id="inner-container">
        <p id="display">{expr}</p>
        <div id="buttons">
          <Button data={{
              name: 'AC',
                id: 'clear'
            }} />
          <Button data={{
              name: 'CE',
                id: 'clear-last'
            }} />
          <Button data={{
              name: '/',
                id: 'divide'
            }} />
          <Button data={{
              name: 'x',
                id: 'multiply'
            }} />
          <Button data={{
              name: '7',
                id: 'seven'
            }} />
          <Button data={{
              name: '8',
                id: 'eight'
            }} />
          <Button data={{
              name: '9',
                id: 'nine'
            }} />
          <Button data={{
              name: '-',
                id: 'subtract'
            }} />
          <Button data={{
              name: '4',
                id: 'four'
            }} />
          <Button data={{
              name: '5',
                id: 'five'
            }} />
          <Button data={{
              name: '6',
                id: 'six'
            }} />
          <Button data={{
              name: '+',
                id: 'add'
            }} />
          <Button data={{
              name: '1',
                id: 'one'
            }} />
          <Button data={{
              name: '2',
                id: 'two'
            }} />
          <Button data={{
              name: '3',
                id: 'three'
            }} />
          <Button data={{
              name: '=',
                id: 'equals'
            }} />
          <Button data={{
              name: '0',
                id: 'zero'
            }} />
          <Button data={{
              name: '.',
                id: 'decimal'
            }} />
        </div>
      </div>
    </Context.Provider>
  );
}

const Button = (props) => {
  const { name, id } = props.data;
  const context = useContext(Context);
  
  return (
    <button onClick={context.handleClick} id={id} class="btn">{name}</button>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));