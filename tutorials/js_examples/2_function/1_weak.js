// 1. this 바인딩
const wkObject = {
  value: 100,
  delayedLog: function() {
    // 일반 함수로 선언한 콜백: this가 myObject가 아닌 전역 객체를 참조함
    setTimeout(function() {
      // console.log(this);
      console.log(this.value); // undefined (또는 전역 객체에 value가 있으면 그 값)
    }, 100);
  }
};

// 2. 함수 내 return 누락
function noret(a, b) {
  a + b;
}

// 3. 생성자 함수를 new 없이 호출
function Person(name) {
  this.name = name;
}

// 4. 클로저 내 변수 업데이트
function createCounter() {
  let count = 0;
  return {
    increment: function() {
      count++;
    },
    getCount: function() {
      return count;
    }
  };
}


// 실행
console.log('--------------------------------');
console.log('1. this 바인딩');
wkObject.delayedLog();

console.log('--------------------------------');
console.log('2. 함수 내 return 누락');
noret(1, 2);

console.log('--------------------------------');
console.log('3. 생성자 함수를 new 없이 호출');
const alice = Person('John');
console.log(global.name); // 'John'

console.log('--------------------------------');
console.log('4. 클로저 내 변수 업데이트 (동시성 문제)');
const c = createCounter();
c.increment();
console.log(c.getCount()); // 1
