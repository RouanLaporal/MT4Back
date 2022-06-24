export type StructuredErrors =
  // SQL
  'sql/failed' |
  'sql/not-found' |

  // Crud
  'validation/failed' |

  // Authorization
  'auth/invalid-credentials' |
  'auth/invalid-password-format' |
  'auth/invalid-email-format' |

  // Validation
  'validation/invalid-code' |
  'validation/invalid-password' |
  'validation/invalid-email' |


  // Default
  'internal/unknown'
  ;