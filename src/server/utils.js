const _seed = 179424673; // 10^7 th prime

const _base = ['f', '8', 'T', 'z', 'm', 'R', 'w', 'o', 'p', 'A', 'Q', 'V', 'd', 'E', 'q', 'L', 'N', '3', 
'6', '5', 'M', 'K', 'u', 'c', 'O', 'B', 'J', 'n', '9', 'I', 'x', 'h', 'e', 'j', 'Z', 'g', 's', '2', '4', 'y', 
'k', 'a', 'S', 'C', '7', 'P', 'b', 'F','v', 'H', 'i', 'X', 'G', '0', 'D', 'U', 'r', 'l', 'W', 'Y', '1', 't'
] // shuffled 62 
  // 0 (base 10) = f
  // 1           = 8
  // 61          = t


export function createIdFromTimeStamp(seed=_seed, base=_base) {
	let x = parseInt(Date.now()) * seed;
	return _10_to_62R(x, base);
}


const log62 = (x) => Math.log(x) / Math.log(62);


/*
Returns a REVERSED string representing a number of base 62

*/
export function _10_to_62R(x, base=_base) {
	if (x < 0) x = -x;
	if (x === 0) return base[x];

	let d = Math.floor(log62(x));
	let s = new Array(d+1);

	let p, q, r; 
	while (x) {
		p = Math.pow(62, d);
		q = Math.floor(x / p);
		x -= p * q;
		
		s[d] = base[q];
		d = Math.floor(log62(x));
	}

	return s.join("");
}

export function test(a, f) {
	for (let i = 0; i < a.length; i++) {
		console.log(a[i] + " " + f(a[i]));
	}
}
