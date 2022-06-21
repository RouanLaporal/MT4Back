export type StructuredErrors =
  // SQL
  'sql/failed' |
  'sql/not-found' |

  // Crud
  'validation/failed' |

  // Authorization
  'auth/invalid-credentials' |

  // Validation
  'validation/invalid-code' |




  // Default
  'internal/unknown'
  ;