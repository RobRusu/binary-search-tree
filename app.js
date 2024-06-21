#!/usr/bin/env node

import { mergeSort } from "./mergeSort.js";

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(root) {
    this.root = this.buildTree(root);
  }

  buildTree(array) {
    // check if array is empty and return null if it is
    if (array.length === 0) {
      return null;
    }

    // sort the array using merge sort
    let sortedArray = mergeSort(array);

    // remove duplicates from the array
    sortedArray = sortedArray.filter(
      (element, index) => sortedArray.indexOf(element) === index
    );

    // get mid point of array
    const mid = Math.floor(sortedArray.length / 2);
    // create root node with the mid point
    const root = new Node(sortedArray[mid]);

    //initialize the queue
    //the array is essentially split into 2 part (start to mid - 1 and mid + 1 to end)
    const q = [
      [root, [0, mid - 1]],
      [root, [mid + 1, sortedArray.length - 1]],
    ];

    while (q.length > 0) {
      // get the first element in the queue
      const [parent, [left, right]] = q.shift();

      if (left <= right && parent != null) {
        // get mid point of queue element
        const mid = Math.floor((left + right) / 2);
        // create child node for the mid point
        const child = new Node(sortedArray[mid]);

        // if the newly created mid is smaller than the parent node then move child node to left else move child node to right
        if (sortedArray[mid] < parent.data) {
          parent.left = child;
        } else {
          parent.right = child;
        }

        // push the child nodes to the queue and repeat process until queue ends
        q.push([child, [left, mid - 1]]);
        q.push([child, [mid + 1, right]]);
      }
    }

    return root;
  }

  insert(value) {
    // main root
    const root = this.root;
    // reference to main root that we can use to traverse the tree and insert value without altering the whole tree
    let currentRoot = root;

    // loop while the inserted value isn't equal to the current root value
    // here a while(true) loop could've worked but currentRoot.data !== value covers the case where the inserted value is already in the tree as well
    while (currentRoot.data !== value) {
      // check if value should go to the left
      if (value < currentRoot.data) {
        // if leaf node is found then create a new node and add it to the leaf node then return
        if (currentRoot.left === null) {
          currentRoot.left = new Node(value);
          return;
        } else {
          // otherwise traverse the tree to the left
          currentRoot = currentRoot.left;
        }
      } else {
        // check if value should go to the right
        // if leaf node is found then create a new node and add it to the leaf node then return
        if (currentRoot.right === null) {
          currentRoot.right = new Node(value);
          return;
        } else {
          // otherwise traverse the tree to the right
          currentRoot = currentRoot.right;
        }
      }
    }
  }

  deleteItem(value) {
    // main root
    const root = this.root;
    // reference to main root that can be used to traverse the tree and get values without altering the whole tree
    let currentRoot = root;
    let previousRoot;

    try {
      // traverse the tree until value is found
      while (currentRoot.data !== value) {
        if (value < currentRoot.data) {
          previousRoot = currentRoot;
          currentRoot = currentRoot.left;
        } else {
          previousRoot = currentRoot;
          currentRoot = currentRoot.right;
        }
      }
    } catch (error) {
      // if value not in the tree return message
      return "Value not in the tree";
    }

    // case 1: delete value in leaf node
    if (
      // check if value is smaller than previous root and update previous root left side if yes
      previousRoot &&
      value < previousRoot.data &&
      currentRoot.left === null &&
      currentRoot.right === null
    ) {
      previousRoot.left = null;
      return;
    } else if (
      // check if value is greater than previous root and update previous root right side if yes
      previousRoot &&
      value > previousRoot.data &&
      currentRoot.left === null &&
      currentRoot.right === null
    ) {
      previousRoot.right = null;
      return;
    }

    // case 2: delete value when parent has 1 child
    if (
      // check if current root has child to the left and nothing to the right
      previousRoot &&
      currentRoot.left !== null &&
      currentRoot.right === null
    ) {
      // if current root value is higher than previous root value then update right node
      if (currentRoot.data > previousRoot.data) {
        previousRoot.right = currentRoot.left;
        return;
      } else {
        // else update left node
        previousRoot.left = currentRoot.left;
        return;
      }
    } else if (
      // check if current root has child to the right and nothing to the left
      previousRoot &&
      currentRoot.right !== null &&
      currentRoot.left === null
    ) {
      // if current root value is higher than previous root value then update right node
      if (currentRoot.data > previousRoot.data) {
        previousRoot.right = currentRoot.right;
        return;
      } else {
        // else update left node
        previousRoot.left = currentRoot.right;
        return;
      }
    }

    // case 3: delete value when parent has 2 children
    // findSmallest is used to move once to the right side of current root
    let findSmallest = currentRoot.right;
    // used to reference previous node
    let temp;

    while (findSmallest.left !== null) {
      // loop until smallest value is found
      temp = findSmallest;
      findSmallest = findSmallest.left;
    }

    // if smallest value is a leaf node then replace value that needs removing with leaf node value and update previous node
    if (findSmallest.left === null && findSmallest.right === null) {
      currentRoot.data = findSmallest.data;
      temp.left = null;
      return;
    }

    if (temp) {
      // if temp is not falsy then update left side of previous node with the right side of findSmallest node and replace the value that needs deleting with the value of findSmallest
      temp.left = findSmallest.right;
      currentRoot.data = findSmallest.data;
      return;
    }
    // otherwise update right side of current root with what is on the right side of the smallest node and update the current root with smallest value found
    currentRoot.right = findSmallest.right;
    currentRoot.data = findSmallest.data;
  }
}

//testing in CLI
const projectArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
const practiceArray = [50];

const tree = new Tree(projectArray);

// print a structured tree to visualize the BST easier
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

console.log(tree.root);
console.log(prettyPrint(tree.root));
