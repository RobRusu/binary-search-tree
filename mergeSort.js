export function mergeSort(array) {
  //base case
  if (array.length == 1) return array;

  //recursive
  let left = mergeSort(array.slice(0, array.length / 2));
  let right = mergeSort(array.slice(array.length / 2));
  array = merge(left, right);

  return array;
}

function merge(left, right) {
  const sortedArray = [];
  let i = 0;
  let j = 0;
  let k = 0;

  // compare elements from the 2 sorted arrays and copy them over in the sorted array
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      sortedArray[k++] = left[i++];
    } else {
      sortedArray[k++] = right[j++];
    }
  }

  // if there are elements left in the left array, copy them over in the sorted array
  for (; i < left.length; i++) {
    sortedArray[k++] = left[i];
  }

  // if there are elements left in the right array, copy them over in the sorted array
  for (; j < right.length; j++) {
    sortedArray[k++] = right[j];
  }

  return sortedArray;
}
