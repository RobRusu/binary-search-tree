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

  deleteItem(value) {}
}

//testing in CLI
const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

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

console.log(tree.insert(6));
console.log(tree.root);
console.log(prettyPrint(tree.root));
