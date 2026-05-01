export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
      notes: [
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
      ],
    },
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists",
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2]
console.log(twoSum([3, 3], 6)); // Expected: [0, 1]`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass

# Test cases
print(twoSum([2, 7, 11, 15], 9))  # Expected: [0, 1]
print(twoSum([3, 2, 4], 6))  # Expected: [1, 2]
print(twoSum([3, 3], 6))  # Expected: [0, 1]`,
      java: `import java.util.*;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9))); // Expected: [0, 1]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 2, 4}, 6))); // Expected: [1, 2]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 3}, 6))); // Expected: [0, 1]
    }
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

void twoSum(int* nums, int numsSize, int target, int* result) {
    // Write your solution here
}

int main() {
    int nums1[] = {2,7,11,15};
    int r1[2];
    twoSum(nums1, 4, 9, r1);
    printf("[%d, %d]\\n", r1[0], r1[1]);

    int nums2[] = {3,2,4};
    int r2[2];
    twoSum(nums2, 3, 6, r2);
    printf("[%d, %d]\\n", r2[0], r2[1]);

    int nums3[] = {3,3};
    int r3[2];
    twoSum(nums3, 2, 6, r3);
    printf("[%d, %d]\\n", r3[0], r3[1]);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> n1 = {2,7,11,15};
    auto r1 = twoSum(n1, 9);
    cout << "[" << r1[0] << ", " << r1[1] << "]" << endl;

    vector<int> n2 = {3,2,4};
    auto r2 = twoSum(n2, 6);
    cout << "[" << r2[0] << ", " << r2[1] << "]" << endl;

    vector<int> n3 = {3,3};
    auto r3 = twoSum(n3, 6);
    cout << "[" << r3[0] << ", " << r3[1] << "]" << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "[0,1]\n[1,2]\n[0,1]",
      python: "[0, 1]\n[1, 2]\n[0, 1]",
      java: "[0, 1]\n[1, 2]\n[0, 1]",
      c: "[0, 1]\n[1, 2]\n[0, 1]",
      cpp: "[0, 1]\n[1, 2]\n[0, 1]",
    },
  },

  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Write a function that reverses a string. The input string is given as an array of characters s.",
      notes: ["You must do this by modifying the input array in-place with O(1) extra memory."],
    },
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ascii character"],
    starterCode: {
      javascript: `function reverseString(s) {
  // Write your solution here
  
}

// Test cases
let test1 = ["h","e","l","l","o"];
reverseString(test1);
console.log(test1); // Expected: ["o","l","l","e","h"]

let test2 = ["H","a","n","n","a","h"];
reverseString(test2);
console.log(test2); // Expected: ["h","a","n","n","a","H"]`,
      python: `def reverseString(s):
    # Write your solution here
    pass

# Test cases
test1 = ["h","e","l","l","o"]
reverseString(test1)
print(test1)  # Expected: ["o","l","l","e","h"]

test2 = ["H","a","n","n","a","h"]
reverseString(test2)
print(test2)  # Expected: ["h","a","n","n","a","H"]`,
      java: `import java.util.*;

class Solution {
    public static void reverseString(char[] s) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        char[] test1 = {'h','e','l','l','o'};
        reverseString(test1);
        System.out.println(Arrays.toString(test1)); // Expected: [o, l, l, e, h]
        
        char[] test2 = {'H','a','n','n','a','h'};
        reverseString(test2);
        System.out.println(Arrays.toString(test2)); // Expected: [h, a, n, n, a, H]
    }
}`,
      c: `#include <stdio.h>
#include <string.h>

void reverseString(char* s, int len) {
    // Write your solution here
}

int main() {
    char t1[] = "hello";
    reverseString(t1, strlen(t1));
    printf("%s\\n", t1);

    char t2[] = "Hannah";
    reverseString(t2, strlen(t2));
    printf("%s\\n", t2);
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void reverseString(vector<char>& s) {
    // Write your solution here
}

int main() {
    vector<char> t1 = {'h','e','l','l','o'};
    reverseString(t1);
    for(auto c : t1) cout << c;
    cout << endl;

    vector<char> t2 = {'H','a','n','n','a','h'};
    reverseString(t2);
    for(auto c : t2) cout << c;
    cout << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
      python: "['o', 'l', 'l', 'e', 'h']\n['h', 'a', 'n', 'n', 'a', 'H']",
      java: "[o, l, l, e, h]\n[h, a, n, n, a, H]",
      c: "olleh\nhannaH",
      cpp: "olleh\nhannaH",
    },
  },

  "valid-palindrome": {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
      notes: ["Given a string s, return true if it is a palindrome, or false otherwise."],
    },
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: "true",
        explanation:
          's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.',
      },
    ],
    constraints: ["1 ≤ s.length ≤ 2 * 10⁵", "s consists only of printable ASCII characters"],
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your solution here
  
}

// Test cases
console.log(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
console.log(isPalindrome("race a car")); // Expected: false
console.log(isPalindrome(" ")); // Expected: true`,
      python: `def isPalindrome(s):
    # Write your solution here
    pass

# Test cases
print(isPalindrome("A man, a plan, a canal: Panama"))  # Expected: True
print(isPalindrome("race a car"))  # Expected: False
print(isPalindrome(" "))  # Expected: True`,
      java: `class Solution {
    public static boolean isPalindrome(String s) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
        System.out.println(isPalindrome("race a car")); // Expected: false
        System.out.println(isPalindrome(" ")); // Expected: true
    }
}`,
      c: `#include <stdio.h>
#include <ctype.h>
#include <string.h>

int isPalindrome(char* s) {
    // Write your solution here
    return 0;
}

int main() {
    printf("%s\\n", isPalindrome("A man, a plan, a canal: Panama") ? "true" : "false");
    printf("%s\\n", isPalindrome("race a car") ? "true" : "false");
    printf("%s\\n", isPalindrome(" ") ? "true" : "false");
    return 0;
}`,
      cpp: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(string s) {
    // Write your solution here
    return false;
}

int main() {
    cout << (isPalindrome("A man, a plan, a canal: Panama") ? "true" : "false") << endl;
    cout << (isPalindrome("race a car") ? "true" : "false") << endl;
    cout << (isPalindrome(" ") ? "true" : "false") << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse\ntrue",
      python: "True\nFalse\nTrue",
      java: "true\nfalse\ntrue",
      c: "true\nfalse\ntrue",
      cpp: "true\nfalse\ntrue",
    },
  },

  "maximum-subarray": {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1.",
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The subarray [5,4,-1,7,8] has the largest sum 23.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your solution here
  
}

// Test cases
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6
console.log(maxSubArray([1])); // Expected: 1
console.log(maxSubArray([5,4,-1,7,8])); // Expected: 23`,
      python: `def maxSubArray(nums):
    # Write your solution here
    pass

# Test cases
print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6
print(maxSubArray([1]))  # Expected: 1
print(maxSubArray([5,4,-1,7,8]))  # Expected: 23`,
      java: `class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // Expected: 6
        System.out.println(maxSubArray(new int[]{1})); // Expected: 1
        System.out.println(maxSubArray(new int[]{5,4,-1,7,8})); // Expected: 23
    }
}`,
      c: `#include <stdio.h>

int maxSubArray(int* nums, int n) {
    // Write your solution here
    return 0;
}

int main() {
    int a1[] = {-2,1,-3,4,-1,2,1,-5,4};
    printf("%d\\n", maxSubArray(a1, 9));
    int a2[] = {1};
    printf("%d\\n", maxSubArray(a2, 1));
    int a3[] = {5,4,-1,7,8};
    printf("%d\\n", maxSubArray(a3, 5));
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> a1 = {-2,1,-3,4,-1,2,1,-5,4};
    cout << maxSubArray(a1) << endl;
    vector<int> a2 = {1};
    cout << maxSubArray(a2) << endl;
    vector<int> a3 = {5,4,-1,7,8};
    cout << maxSubArray(a3) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "6\n1\n23",
      python: "6\n1\n23",
      java: "6\n1\n23",
      c: "6\n1\n23",
      cpp: "6\n1\n23",
    },
  },

  "container-with-most-water": {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).",
      notes: [
        "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
        "Return the maximum amount of water a container can store.",
        "Notice that you may not slant the container.",
      ],
    },
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation:
          "The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.",
      },
      {
        input: "height = [1,1]",
        output: "1",
      },
    ],
    constraints: ["n == height.length", "2 ≤ n ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your solution here
  
}

// Test cases
console.log(maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log(maxArea([1,1])); // Expected: 1`,
      python: `def maxArea(height):
    # Write your solution here
    pass

# Test cases
print(maxArea([1,8,6,2,5,4,8,3,7]))  # Expected: 49
print(maxArea([1,1]))  # Expected: 1`,
      java: `class Solution {
    public static int maxArea(int[] height) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7})); // Expected: 49
        System.out.println(maxArea(new int[]{1,1})); // Expected: 1
    }
}`,
      c: `#include <stdio.h>

int maxArea(int* height, int n) {
    // Write your solution here
    return 0;
}

int main() {
    int h1[] = {1,8,6,2,5,4,8,3,7};
    printf("%d\\n", maxArea(h1, 9));
    int h2[] = {1,1};
    printf("%d\\n", maxArea(h2, 2));
    return 0;
}`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int maxArea(vector<int>& height) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> h1 = {1,8,6,2,5,4,8,3,7};
    cout << maxArea(h1) << endl;
    vector<int> h2 = {1,1};
    cout << maxArea(h2) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "49\n1",
      python: "49\n1",
      java: "49\n1",
      c: "49\n1",
      cpp: "49\n1",
    },
  },

  "fizz-buzz": {
    id: "fizz-buzz",
    title: "FizzBuzz",
    difficulty: "Easy",
    category: "Math • String",
    description: {
      text: "Given an integer n, return a string array answer where answer[i] == 'FizzBuzz' if i is divisible by 3 and 5, 'Fizz' if divisible by 3, 'Buzz' if divisible by 5, or i (as a string) otherwise.",
      notes: ["i is 1-indexed."],
    },
    examples: [
      { input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' },
      { input: "n = 3", output: '["1","2","Fizz"]' },
    ],
    constraints: ["1 ≤ n ≤ 10⁴"],
    starterCode: {
      javascript: `function fizzBuzz(n) {\n  // Write your solution here\n}\n\nconsole.log(fizzBuzz(5));\nconsole.log(fizzBuzz(3));`,
      python: `def fizzBuzz(n):\n    # Write your solution here\n    pass\n\nprint(fizzBuzz(5))\nprint(fizzBuzz(3))`,
      java: `import java.util.*;\n\nclass Solution {\n    public static List<String> fizzBuzz(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n    public static void main(String[] args) {\n        System.out.println(fizzBuzz(5));\n        System.out.println(fizzBuzz(3));\n    }\n}`,
      c: `#include <stdio.h>\n\nvoid fizzBuzz(int n) {\n    // Write your solution here\n    for(int i = 1; i <= n; i++) {\n        if(i > 1) printf(\",\");\n    }\n    printf(\"\\\\n\");\n}\n\nint main() {\n    fizzBuzz(5);\n    fizzBuzz(3);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> fizzBuzz(int n) {\n    // Write your solution here\n    return {};\n}\n\nint main() {\n    auto r1 = fizzBuzz(5);\n    for(int i=0;i<r1.size();i++) { if(i) cout << \",\"; cout << r1[i]; }\n    cout << endl;\n    auto r2 = fizzBuzz(3);\n    for(int i=0;i<r2.size();i++) { if(i) cout << \",\"; cout << r2[i]; }\n    cout << endl;\n    return 0;\n}`,
    },
    expectedOutput: {
      javascript: '[ "1", "2", "Fizz", "4", "Buzz" ]\n[ "1", "2", "Fizz" ]',
      python: "['1', '2', 'Fizz', '4', 'Buzz']\n['1', '2', 'Fizz']",
      java: "[1, 2, Fizz, 4, Buzz]\n[1, 2, Fizz]",
      c: "1,2,Fizz,4,Buzz\n1,2,Fizz",
      cpp: "1,2,Fizz,4,Buzz\n1,2,Fizz",
    },
  },

  "valid-parentheses": {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack • String",
    description: {
      text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      notes: [
        "An input string is valid if open brackets are closed by the same type and in the correct order.",
        "Every close bracket has a corresponding open bracket of the same type.",
      ],
    },
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'"],
    starterCode: {
      javascript: `function isValid(s) {\n  // Write your solution here\n}\n\nconsole.log(isValid("()"));\nconsole.log(isValid("()[]{}"));\nconsole.log(isValid("(]"));`,
      python: `def isValid(s):\n    # Write your solution here\n    pass\n\nprint(isValid("()"))\nprint(isValid("()[]{}"))\nprint(isValid("(]"))`,
      java: `class Solution {\n    public static boolean isValid(String s) {\n        // Write your solution here\n        return false;\n    }\n    public static void main(String[] args) {\n        System.out.println(isValid("()"));\n        System.out.println(isValid("()[]{}"));\n        System.out.println(isValid("(]"));\n    }\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n\nint isValid(char* s) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    printf(\"%s\\\\n\", isValid("()") ? "true" : "false");\n    printf(\"%s\\\\n\", isValid("()[]{}") ? "true" : "false");\n    printf(\"%s\\\\n\", isValid("(]") ? "true" : "false");\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nbool isValid(string s) {\n    // Write your solution here\n    return false;\n}\n\nint main() {\n    cout << (isValid("()") ? "true" : "false") << endl;\n    cout << (isValid("()[]{}") ? "true" : "false") << endl;\n    cout << (isValid("(]") ? "true" : "false") << endl;\n    return 0;\n}`,
    },
    expectedOutput: {
      javascript: "true\ntrue\nfalse",
      python: "True\nTrue\nFalse",
      java: "true\ntrue\nfalse",
      c: "true\ntrue\nfalse",
      cpp: "true\ntrue\nfalse",
    },
  },

  "binary-search": {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Array • Binary Search",
    description: {
      text: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.",
      notes: ["You must write an algorithm with O(log n) runtime complexity."],
    },
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4." },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist in nums so return -1." },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁴", "-10⁴ < nums[i], target < 10⁴", "All integers in nums are unique", "nums is sorted in ascending order"],
    starterCode: {
      javascript: `function search(nums, target) {\n  // Write your solution here\n}\n\nconsole.log(search([-1,0,3,5,9,12], 9));\nconsole.log(search([-1,0,3,5,9,12], 2));`,
      python: `def search(nums, target):\n    # Write your solution here\n    pass\n\nprint(search([-1,0,3,5,9,12], 9))\nprint(search([-1,0,3,5,9,12], 2))`,
      java: `class Solution {\n    public static int search(int[] nums, int target) {\n        // Write your solution here\n        return -1;\n    }\n    public static void main(String[] args) {\n        System.out.println(search(new int[]{-1,0,3,5,9,12}, 9));\n        System.out.println(search(new int[]{-1,0,3,5,9,12}, 2));\n    }\n}`,
      c: `#include <stdio.h>\n\nint search(int* nums, int n, int target) {\n    // Write your solution here\n    return -1;\n}\n\nint main() {\n    int a[] = {-1,0,3,5,9,12};\n    printf(\"%d\\\\n\", search(a, 6, 9));\n    printf(\"%d\\\\n\", search(a, 6, 2));\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    // Write your solution here\n    return -1;\n}\n\nint main() {\n    vector<int> a = {-1,0,3,5,9,12};\n    cout << search(a, 9) << endl;\n    cout << search(a, 2) << endl;\n    return 0;\n}`,
    },
    expectedOutput: {
      javascript: "4\n-1",
      python: "4\n-1",
      java: "4\n-1",
      c: "4\n-1",
      cpp: "4\n-1",
    },
  },

  "climbing-stairs": {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      notes: [],
    },
    examples: [
      { input: "n = 2", output: "2", explanation: "1. 1 step + 1 step  2. 2 steps" },
      { input: "n = 3", output: "3", explanation: "1. 1+1+1  2. 1+2  3. 2+1" },
    ],
    constraints: ["1 ≤ n ≤ 45"],
    starterCode: {
      javascript: `function climbStairs(n) {\n  // Write your solution here\n}\n\nconsole.log(climbStairs(2));\nconsole.log(climbStairs(3));\nconsole.log(climbStairs(5));`,
      python: `def climbStairs(n):\n    # Write your solution here\n    pass\n\nprint(climbStairs(2))\nprint(climbStairs(3))\nprint(climbStairs(5))`,
      java: `class Solution {\n    public static int climbStairs(int n) {\n        // Write your solution here\n        return 0;\n    }\n    public static void main(String[] args) {\n        System.out.println(climbStairs(2));\n        System.out.println(climbStairs(3));\n        System.out.println(climbStairs(5));\n    }\n}`,
      c: `#include <stdio.h>\n\nint climbStairs(int n) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    printf(\"%d\\\\n\", climbStairs(2));\n    printf(\"%d\\\\n\", climbStairs(3));\n    printf(\"%d\\\\n\", climbStairs(5));\n    return 0;\n}`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint climbStairs(int n) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    cout << climbStairs(2) << endl;\n    cout << climbStairs(3) << endl;\n    cout << climbStairs(5) << endl;\n    return 0;\n}`,
    },
    expectedOutput: {
      javascript: "2\n3\n8",
      python: "2\n3\n8",
      java: "2\n3\n8",
      c: "2\n3\n8",
      cpp: "2\n3\n8",
    },
  },

  "merge-sorted-arrays": {
    id: "merge-sorted-arrays",
    title: "Merge Sorted Array",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order. Merge nums2 into nums1 as one sorted array.",
      notes: [
        "The final sorted array should not be returned by the function, but instead be stored inside nums1.",
        "nums1 has a length of m + n, where the first m elements denote elements to merge, and the last n are set to 0.",
      ],
    },
    examples: [
      { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
      { input: "nums1 = [1], m = 1, nums2 = [], n = 0", output: "[1]" },
    ],
    constraints: ["nums1.length == m + n", "nums2.length == n", "0 ≤ m, n ≤ 200"],
    starterCode: {
      javascript: `function merge(nums1, m, nums2, n) {\n  // Write your solution here\n}\n\nlet a1 = [1,2,3,0,0,0];\nmerge(a1, 3, [2,5,6], 3);\nconsole.log(a1);\nlet a2 = [1];\nmerge(a2, 1, [], 0);\nconsole.log(a2);`,
      python: `def merge(nums1, m, nums2, n):\n    # Write your solution here\n    pass\n\na1 = [1,2,3,0,0,0]\nmerge(a1, 3, [2,5,6], 3)\nprint(a1)\na2 = [1]\nmerge(a2, 1, [], 0)\nprint(a2)`,
      java: `import java.util.*;\n\nclass Solution {\n    public static void merge(int[] nums1, int m, int[] nums2, int n) {\n        // Write your solution here\n    }\n    public static void main(String[] args) {\n        int[] a1 = {1,2,3,0,0,0};\n        merge(a1, 3, new int[]{2,5,6}, 3);\n        System.out.println(Arrays.toString(a1));\n        int[] a2 = {1};\n        merge(a2, 1, new int[]{}, 0);\n        System.out.println(Arrays.toString(a2));\n    }\n}`,
      c: `#include <stdio.h>\n\nvoid merge(int* nums1, int m, int* nums2, int n) {\n    // Write your solution here\n}\n\nint main() {\n    int a1[] = {1,2,3,0,0,0};\n    int b1[] = {2,5,6};\n    merge(a1, 3, b1, 3);\n    for(int i=0;i<6;i++) printf(\"%d \", a1[i]);\n    printf(\"\\\\n\");\n    int a2[] = {1};\n    merge(a2, 1, NULL, 0);\n    printf(\"%d\\\\n\", a2[0]);\n    return 0;\n}`,
      cpp: `#include <iostream>\n#include <vector>\nusing namespace std;\n\nvoid merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n    // Write your solution here\n}\n\nint main() {\n    vector<int> a1 = {1,2,3,0,0,0};\n    vector<int> b1 = {2,5,6};\n    merge(a1, 3, b1, 3);\n    for(int x : a1) cout << x << \" \";\n    cout << endl;\n    vector<int> a2 = {1};\n    vector<int> b2 = {};\n    merge(a2, 1, b2, 0);\n    cout << a2[0] << endl;\n    return 0;\n}`,
    },
    expectedOutput: {
      javascript: "[ 1, 2, 2, 3, 5, 6 ]\n[ 1 ]",
      python: "[1, 2, 2, 3, 5, 6]\n[1]",
      java: "[1, 2, 2, 3, 5, 6]\n[1]",
      c: "1 2 2 3 5 6 \n1",
      cpp: "1 2 2 3 5 6 \n1",
    },
  },
};

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },
  python: {
    name: "Python",
    icon: "/python.png",
    monacoLang: "python",
  },
  java: {
    name: "Java",
    icon: "/java.png",
    monacoLang: "java",
  },
  c: {
    name: "C",
    icon: "/c.png",
    monacoLang: "c",
  },
  cpp: {
    name: "C++",
    icon: "/cpp.png",
    monacoLang: "cpp",
  },
};