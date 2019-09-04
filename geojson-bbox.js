module.exports = function(gj) {
  let coords;
  if (!gj.hasOwnProperty('type')) return;
  coords = getCoordinatesDump(gj);
  return coords.reduce(
    function(prev, coord) {
      return [
        Math.min(coord[0], prev[0]),
        Math.min(coord[1], prev[1]),
        Math.max(coord[0], prev[2]),
        Math.max(coord[1], prev[3])
      ];
    },
    [
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      Number.NEGATIVE_INFINITY
    ]
  );
};

function getCoordinatesDump(gj) {
  let coords;
  if (gj.type == 'Point') {
    coords = [gj.coordinates];
  } else if (gj.type == 'LineString' || gj.type == 'MultiPoint') {
    coords = gj.coordinates;
  } else if (gj.type == 'Polygon' || gj.type == 'MultiLineString') {
    coords = gj.coordinates.reduce(function(dump, part) {
      dump.push(...part);
      return dump;
    }, []);
  } else if (gj.type == 'MultiPolygon') {
    coords = gj.coordinates.reduce(function(dump, poly) {
      return dump.push(
        ...poly.reduce(function(points, part) {
          points.push(...part);
          return points;
        }, [])
      );
    }, []);
  } else if (gj.type == 'Feature') {
    coords = getCoordinatesDump(gj.geometry);
  } else if (gj.type == 'GeometryCollection') {
    coords = gj.geometries.reduce(function(dump, g) {
      dump.push(...getCoordinatesDump(g));
      return dump;
    }, []);
  } else if (gj.type == 'FeatureCollection') {
    coords = gj.features.reduce(function(dump, f) {
      dump.push(...getCoordinatesDump(f));
      return dump;
    }, []);
  }
  return coords;
}
