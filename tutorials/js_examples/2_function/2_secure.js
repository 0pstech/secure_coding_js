// 1. this 바인딩
const scObject = {
  value: 100,
  delayedLog: function() {
    setTimeout(() => {
    //   console.log(this);
      console.log(this.value); // 100
    }, 100);
  }
};

// 2. 함수 내 return 
function ret(a, b) {
    return a + b;
}


// 3. 생성자 함수를 new 없이 호출
function Person(name) {
    this.name = name;
}  

// 실행
console.log('--------------------------------');
console.log('1. this 바인딩');
scObject.delayedLog();

console.log('--------------------------------');
console.log('2. 함수 내 return 누락');
ret(1, 2);

console.log('--------------------------------');
console.log('3. 생성자 함수를 new 없이 호출');
const alice = new Person('John');
console.log('name: ', global.name); // 'John'
