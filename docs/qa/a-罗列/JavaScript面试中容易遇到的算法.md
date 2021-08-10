## JavaScript面试中容易遇到的算法

> [https://mp.weixin.qq.com/s/Yf91_5UJU3J9HVCthHIQfQ](https://mp.weixin.qq.com/s/Yf91_5UJU3J9HVCthHIQfQ)

### **素数**

**Q：你将如何验证一个素数？**

A：一个素数只能被它自己和1整除。所以，我将运行一个while循环并加1。（看代码示例，如果你无法理解，那这不是你的菜。先回去学习JavaScript基础知识然后再回来吧。）

**方法1**

```js

function isPrime(n){
 var divisor = 2;
 while (n > divisor){
 if(n % divisor == 0){
  return false; 
 }
 else
  divisor++;
 }
 return true;
}
isPrime(137); // = true
isPrime(237); // = false
```

**Q：你能做得更好吗？**

A：可以。除数一次增加1个。在3之后我可以增加2.如果一个数可以被任何偶数整除，它将被2整除。

补充：如果你不需要把除数增加到这个数。你可以更早停止。让我在下面的步骤中解释一下（如果需要可以多读几遍）

第一步，任何数字都不能被大于它的一半的数字整除。例如，13将永远不能被7,8,9整除……它甚至可以是偶数的一半。例如，16将被8整除，但永远不会被9,10,11,12 ……
结论：一个数字将永远不能被一个大于其一半数值的数字整除。所以，我们可以少循环50％。

第二步，现在，如果一个数字不能被3整除。（如果它可被3整除，那么它就不是质数）。

然后，它不可以被大于其值1/3的任何数整除。例如，35不能被3整除。因此，它永远不会被大于35/3的数整除，永远不能被12, 13, 14整除…如果你取一个像36一样的偶数，它将永远不能被13, 14, 15整除。

结论：一个数字可以被其数值的三分之一整除。

第三步，例如，你有一个数字127。127不能被2整除，因此你最多应该检查63.5。其次，127不能被3整除。

因此，您将检查到127/3大约42。它不能被5整除，除数应该小于127/5大约25，而不是7。那么，我们该在哪里停下来？
结论：除数将小于math.sqrt（N）

**方法2**

如果你不能理解也不用担心，别管它。如果那你不是一个研究人员就没关系。

```js

function isPrime(n)
{
 var divisor = 3, 
  limit = Math.sqrt(n);
 //check simple cases
 if (n == 2 || n == 3)
  return true;
 if (n % 2 == 0)
  return false;
 while (divisor <= limit)
 {
 if (n % divisor == 0)
  return false;
 else
  divisor += 2;
 }
 return true;
}
isPrime(137); // = true
isPrime(237); // = false
```

### **素数因子**

**Q：如何求出一个数的所有素数因子？**
A：执行一个while循环。开始除以2，如果不能整除，记录这个除数，直到完成。

```js

function primeFactors(n){
 var factors = [], 
  divisor = 2;
 while(n>2){
 if(n % divisor == 0){
  factors.push(divisor); 
  n= n/ divisor;
 }
 else{
  divisor++;
 }  
 }
 return factors;
}
 primeFactors(69); // = [3, 23]
```

**Q：运行时间复杂度是多少？你能做得更好吗？**

A：O(n)。可以将除数从3开始，累加2。因为，如果一个数被任何偶数整除，它将被2整除。因此，你不需要除以偶数。此外，你不会有一个大于其价值一半的因素。如果你想让它变得复杂，那就用第一题的补充概念吧。

### **Fibonacci（斐波那契）**

**Q：如何获得第n个斐波纳契数字？**
A：我创建一个数组并从迭代开始。

斐波那契系列是面向初学者的最受欢迎的面试问题之一。所以，你必须学习这一个。

**方法1**

```js

function fibonacci(n){
 var fibo = [0, 1];
 if (n <= 2) return 1;
 for (var i = 2; i <=n; i++ ){
 fibo[i] = fibo[i-1]+fibo[i-2];
 }
 return fibo[n];
} 
fibonacci(12); // = 144
```

**Q：运行时间复杂度是多少？**

A：O(n)；

**Q：你能让它递归吗？**

**方法2**


```js

function fibonacci(n){
 if(n < =1) {
  return n;
 } else {
  return fibonacci(n-1) + fibonacci (n-2);
 }
}
fibonacci(12); // = 144
```

**Q：运行时间复杂度是多少？**
A：O(2n)；关于时间复杂度的细节

### **最大公约数**

**Q: 你会如何找到两个数字的最大公约数？**

```js

function greatestCommonDivisor(a, b){
 var divisor = 2, 
  greatestDivisor = 1;
 //if u pass a -ve number this will not work. fix it dude!!
 if (a < 2 || b < 2)
  return 1;
 while(a >= divisor && b >= divisor){
 if(a %divisor == 0 && b% divisor ==0){
  greatestDivisor = divisor;  
 }
 divisor++;
 }
 return greatestDivisor;
}
greatestCommonDivisor(14, 21); // 7
greatestCommonDivisor(69, 169); // = 1
```

### **算法范式**

很抱歉。我也无法解释它。因为我自己80％的情况下都不能理解它。我的算法分析教练告诉我这个，又从课堂笔记偷走（我是一个好学生，顺便说一句！）

```js
function greatestCommonDivisor(a, b){
 if(b == 0)
  return a;
 else 
  return greatestCommonDivisor(b, a%b);
}
```

注意：用你的大脑来理解它。

### **去重**

**Q：你将如何从数组中删除重复的成员？**
A：执行一个循环，并保存一个对象/关联数组。如果我第一次找到一个元素，我会设置它的值为真（这将告诉我元素添加一次）。如果我在对象中找到这个元素，我不会将它插入到返回数组中。

```js

function removeDuplicate(arr){
 var exists ={},
  outArr = [], 
  elm;
 for(var i =0; i<arr.length; i++){
 elm = arr[i];
 if(!exists[elm]){
  outArr.push(elm);
  exists[elm] = true;
 }
 }
 return outArr;
}
removeDuplicate([1,3,3,3,1,5,6,7,8,1]); // = [1, 3, 5, 6, 7, 8]
```

### **合并两个排序的数组**

**Q：怎样合并两个已排序数组？**
A：我将为每个数组保留一个指针（看代码，并注意这个）。

```js

function mergeSortedArray(a, b){
 var merged = [], 
   aElm = a[0],
   bElm = b[0],
   i = 1,
   j = 1;
 if(a.length ==0)
  return b;
 if(b.length ==0)
  return a;
 /* 
 if aElm or bElm exists we will insert to merged array
 (will go inside while loop)
  to insert: aElm exists and bElm doesn't exists
       or both exists and aElm < bElm
  this is the critical part of the example      
 */
 while(aElm || bElm){
  if((aElm && !bElm) || aElm < bElm){
   merged.push(aElm);
   aElm = a[i++];
  }  
  else {
   merged.push(bElm);
   bElm = b[j++];
  }
 }
 return merged;
}
mergeSortedArray([2,5,6,9], [1,2,3,29]);// = [1, 2, 2, 3, 5, 6, 9, 29]
```

不通过临时变量交换两个数的值

**Q：如何在不使用临时变量的情况下交换两个数字？**

```js
function swapNumb(a, b){
 console.log('before swap: ','a: ', a, 'b: ', b);
 b = b -a;
 a = a+ b;
 b = a-b;
 console.log('after swap: ','a: ', a, 'b: ', b); 
}
swapNumb(2, 3);
//  = before swap: a: 2 b: 3
//  = after swap: a: 3 b: 2
```

位操作：对不起，我无法向你解释这一点。Kinjal Dave建议到 logical conjunction理解它。将浪费您30分钟。

```js

function swapNumb(a, b){
 console.log("a: " + a + " and b: " + b);
 a = a ^ b;
 b = a ^ b;
 a = a ^ b;
 console.log("a: " + a + " and b: " + b);
}
swapNumb(2, 3);
// = a: 2 and b: 3
// = a: 3 and b: 2
```

### **字符串反向**

**Q：如何在JavaScript中反转字符串？**
A：可以遍历字符串并将字母连接到新字符串。

**方法1**
```js
function reverse(str){
 var rtnStr = '';
 for(var i = str.length-1; i>=0;i--){
  rtnStr +=str[i];
 }
 return rtnStr;
}
reverse('you are a nice dude');
// = "edud ecin a era uoy"
```

**Q：你知道在现代浏览器中串联效果很好，但在像IE8这样的旧浏览器中会变慢。还有什么不同的方法，可以扭转一个字符串？**

A：当然.我可以使用数组，也可以添加一些检查。如果字符串是NULL或其他字符串，这将失败。让我也做一些类型检查。使用此数组类似于在某些服务器端语言中使用字符串缓冲区。

**方法2**

```js

function reverse(str){
 var rtnStr = [];
 if(!str || typeof str != 'string' || str.length < 2 ) return str;
 for(var i = str.length-1; i>=0;i--){
  rtnStr.push(str[i]);
 }
 return rtnStr.join('');
}
```

**Q：运行时间复杂度是多少？**
A：O(n)；
**Q：可以做得更好？**
A：我可以遍历索引的一半，它会节省一点点。（这是没用的，可能不会打动面试官）

**方法3**

```js

function reverse(str) {
 str = str.split('');
 var len = str.length,
   halfIndex = Math.floor(len / 2) - 1,
   revStr;
 for (var i = 0; i <= halfIndex; i++) {
  revStr = str[len - i - 1];
  str[len - i - 1] = str[i];
  str[i] = revStr;
 }
 return str.join('');
}
```

**Q：这有效，但你可以做递归的方式吗？**
A：可以。

**方法4**


```js

function reverse (str) {
  if (str === "") {
    return "";
  } else {
    return reverse(str.substr(1)) + str.charAt(0);
  }
}
```

**方法5**

Q：你可以在方法中使用任何构建，使它更清洁吗？

 **JavaScript**

```js

function reverse(str){
 if(!str || str.length <2) return str;
 return str.split('').reverse().join('');
}
```

**方法6**

**Q：你可以做反向函数作为字符串扩展吗？**
A：我需要将这个函数添加到String.prototype，而不是使用str作为参数，我需要使用this

```js

String.prototype.reverse = function (){
 if(!this || this.length <2) return this;
 return this.split('').reverse().join('');
}
'abc'.reverse();
// = 'cba'
```

### **单词反转**

**Q：你如何在句子中颠倒单词？**
A：您必须检查整个字符串的空白区域。确定是否可能有多个空格。

```js

//have a tailing white space
//fix this later
//now i m sleepy
function reverseWords(str){
 var rev = [], 
   wordLen = 0;
 for(var i = str.length-1; i>=0; i--){
  if(str[i]==' ' || i==0){
   rev.push(str.substr(i,wordLen+1));
   wordLen = 0;
  }
  else
   wordLen++;
 }
 return rev.join(' ');
}
```

内置方法的快速解决方案：

```

function reverseWords(str){
 return str.split(' ').reverse();
}
```

### **原位反转**

Q: 如果你有一个字符串如”I am the good boy”， 怎样变为 “I ma eht doog yob”？注意这些单词位置不变但是被反转了。

A: 要做到这一点，我必须做字符串反向和字反转。

```js
function reverseInPlace(str){
 return str.split(' ').reverse().join(' ').split('').reverse().join('');
}
reverseInPlace('I am the good boy');// = "I ma eht doog yob"
```

Q: ok。好的，你能不使用内置反向函数做到吗？
A: (内心独白)有没有搞错！！

```js

//sum two methods.
//you can simply split words by ' '
//and for each words, call reverse function
//put reverse in a separate function
//if u cant do this, 
//have a glass of water, and sleep
```

### **第一个非重复字符**

Q: 怎么在字符串中找到第一个非重复字符？
A: 有什么条件吗？
A: 比如是否区分大小写？
面试官可能会说No。
A: 是长字符串还是短字符串？
Q: 这些有什么关系吗？

A:例如，如果它是一个非常长的字符串，说一百万个字符，我想检查是否有26个英文字符正在重复。我可能会检查是否所有字符都在每200个字母中重复（例如），而不是循环遍历整个字符串。这将节省计算时间。
Q: 简单起见， 这个字符串是 “the quick brown fox jumps then quickly blow air”。

```js

function firstNonRepeatChar(str){
 var len = str.length,
   char, 
   charCount = {};
 for(var i =0; i<len; i++){
  char = str[i];
  if(charCount[char]){
   charCount[char]++;
  }
  else
   charCount[char] = 1;
 }
 for (var j in charCount){
  if (charCount[j]==1)
    return j;
 }
} 
firstNonRepeatChar('the quick brown fox jumps then quickly blow air');// = "f"
```

这有一个问题，不能再循环中及时退出。

### **删除重复的字符**

Q: 怎样删除字符串中的重复字符？

A: 这与第一个非重复字符非常相似。你应该问一些类似的问题。它是区分大小写的吗？。

如果面试官说，这是区分大小写的，那么你就很轻松了。如果他说不。你可以使用string.toLowercase（）来把字符串。面试官可能不喜欢这个方法。因为返回字符串不会拥有相同的大小写。所以


```js

function removeDuplicateChar(str){
 var len = str.length,
   char, 
   charCount = {}, 
   newStr = [];
 for(var i =0; i<len; i++){
  char = str[i];
  if(charCount[char]){
   charCount[char]++;
  }
  else
   charCount[char] = 1;
 }
 for (var j in charCount){
  if (charCount[j]==1)
    newStr.push(j);
 }
 return newStr.join('');
}
removeDuplicateChar('Learn more javascript dude'); // = "Lnmojvsciptu"
```

### **回文检查**

Q: 如何检查一个字符串是否是回文？

A: 把字符串反转，如果反转前后相等，那么它就是回文。

```js

function isPalindrome(str){
 var i, len = str.length;
 for(i =0; i<len/2; i++){
  if (str[i]!== str[len -1 -i])
    return false;
 }
 return true;
}
isPalindrome('madam')
// = true
isPalindrome('toyota')
// = false
```

或者

```js

function checkPalindrom(str) {
  return str == str.split('').reverse().join('');
}
```

类似的：在 O(n)时间复杂度内判断一个字符串是否包含在回文字符串内。你能在O（1）时间解决问题吗？

### **找缺失的数字**

Q: 在一个1到100的未排序数组中找到缺失的数，你怎么做？

说明：数组中的数字为1到100。数组中只有一个数字缺失。数组未排序。找到缺少的数字。

A: 你必须表现得像是在想很多。然后讨论n＝n（n＋1）／2的线性级数之和

```js

function missingNumber(arr){
 var n = arr.length+1, 
   sum = 0,
   expectedSum = n * (n+1)/2;
 for(var i = 0, len = arr.length; i < len; i++){
  sum += arr[i];
 }
 return expectedSum - sum;
}
missingNumber([5, 2, 6, 1, 3]);
// = 4
```

注意：这个会返回任意长度数组中缺失的那个

### **两数之和**

Q: 在一个未排序的数组中找出是否有任意两数之和等于给定的数？
A: 简单！双重循环。

```js

function sumFinder(arr, sum){
 var len = arr.length;
 for(var i =0; i<len-1; i++){ 
   for(var j = i+1;j<len; j++){
    if (arr[i] + arr[j] == sum)
      return true;
   }
 }
 return false;
}
sumFinder([6,4,3,2,1,7], 9);
// = true
sumFinder([6,4,3,2,1,7], 2);
// = false
```

Q: 时间复杂度？
A: O(n2)。
Q: 有更优解？
A: 我想想。我可以用一个对象来存储当前元素和和值的差值。当我拿到一个新元素，如果这个元素的差值在对象中存在，那么我就能判断出是否存在。

```js

function sumFinder(arr, sum){
 var differ = {}, 
   len = arr.length,
   substract;
 for(var i =0; i<len; i++){
   substract = sum - arr[i];
   if(differ[substract])
    return true;    
   else
    differ[arr[i]] = true;
 }
 return false;
}
sumFinder([6,4,3,2,1,7], 9);
// = true
sumFinder([6,4,3,2,1,7], 2);
// = false
```

### **最大和**

Q: 找到任意两个元素的最大总和？

A: 这实际上非常简单直接。找到两个最大的数字并返回它们的总和


```js

function topSum(arr){
 var biggest = arr[0], 
   second = arr[1], 
   len = arr.length, 
   i = 2;
 if (len<2) return null;
 if (biggest<second){
  biggest = arr[1];
  second = arr[0];
 } 
 for(; i<len; i++){
  if(arr[i] > biggest){
   second = biggest;
   biggest = arr[i];
  }
  else if (arr[i]>second){
   second = arr[i];
  }
 }
 return biggest + second;
}
```

### **统计零**

Q: 统计从1到n的零总数？

A: 如果 n = 100，则0的数目将是11（0,10,20,30,40,50,60,70,80,90,100）。请注意，100有两个0.这个看起来很简单，但有点棘手

说明：所以这里的重点是。如果你有一个1到50的数字，那么这个数值就是5，就是50除以10.然而，如果这个数值是100，这个数值是11，你将得到100/10 = 10和 10/10 = 1。

那就是你将如何在一个数字中得到更多的零，如（100，200，1000）；


```js

function countZero(n){
 var count = 0;
 while(n>0){
  count += Math.floor(n/10);
  n = n/10;
 }
 return count;
}
countZero(2014);
// = 223
```

### **子字符串**

Q: 在字符串中匹配子字符串？

A: 在迭代字符串时将使用指针（一个用于字符串，另一个用于子字符串）。然后用另一个变量来保存初始匹配的起始索引。


```js

function subStringFinder(str, subStr){
 var idx = 0,
   i = 0,
   j = 0,
   len = str.length,
   subLen = subStr.length;
  for(; i<len; i++){
   if(str[i] == subStr[j])
     j++;
   else
     j = 0;
   //check starting point or a match  
   if(j == 0)
    idx = i;
   else if (j == subLen)
    return idx;
 }
 return -1;
}
subStringFinder('abbcdabbbbbck', 'ab')
// = 0
subStringFinder('abbcdabbbbbck', 'bck')
// = 9
//doesn't work for this one.
subStringFinder('abbcdabbbbbck', 'bbbck') 
// = -1
```

### **排列**

Q: 如何获取字符串中的所有排列？

A: 根据您对算法的了解程度，这可能会很困难。

```js

function permutations(str){
  var arr = str.split(''),
    len = arr.length, 
    perms = [],
    rest,
    picked,
    restPerms,
    next;
  if (len == 0)
    return [str];
  for (var i=0; i<len; i++)
  {
    rest = Object.create(arr);
    picked = rest.splice(i, 1);
    restPerms = permutations(rest.join(''));
    for (var j=0, jLen = restPerms.length; j< jLen; j++)
    {
      next = picked.concat(restPerms[j]);
      perms.push(next.join(''));
    }
  }
  return perms;
}
```