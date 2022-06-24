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

  'ssh/invalid-credentials' |


  // Default
  'internal/unknown'
  ;