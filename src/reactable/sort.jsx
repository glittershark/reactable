export var Sort = {
    Numeric(a, b) {
        var valA = parseFloat(a.toString().replace(/,/g,''));
        var valB = parseFloat(b.toString().replace(/,/g,''));

        // Sort non-numeric values alphabetically at the bottom of the list
        if (isNaN(valA) && isNaN(valB)) {
            valA = a;
            valB = b;
        } else {
            if (isNaN(valA)) {
                return 1;
            }
            if (isNaN(valB)) {
                return -1;
            }
        }

        if (valA < valB) {
            return -1;
        }
        if (valA > valB) {
            return 1;
        }

        return 0;
    },

    NumericInteger(a, b) {
      if (isNaN(a) || isNaN(b)) {
        return a > b ? 1 : -1;
      }

      return a - b;
    },

    Currency(a, b) {
        // get only number from string (remove $ € EUR etc)

        a = a.replace(/\D/g, '');
        b = b.replace(/\D/g, '');

        return exports.Sort.Numeric(a, b);
    },

    Date(a, b) {
        // Note: this function tries to do a standard javascript string -> date conversion
        // If you need more control over the date string format, consider using a different
        // date library and writing your own function
        var valA = Date.parse(a);
        var valB = Date.parse(b);

        // Handle non-date values with numeric sort
        // Sort non-numeric values alphabetically at the bottom of the list
        if (isNaN(valA) || isNaN(valB)) {
            return exports.Sort.Numeric(a, b);
        }

        if (valA > valB) {
            return 1;
        }
        if (valB > valA) {
            return -1;
        }

        return 0;
    },

    CaseInsensitive(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    }
};

