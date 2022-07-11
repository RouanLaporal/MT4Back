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
  'auth/missing-header' |
  'auth/missing-password' |

  // Validation
  'validation/invalid-code' |
  'validation/invalid-password' |
  'validation/invalid-email' |

  //Challenge
  'challenge/not-active' |

  // Default
  'internal/unknown'
  ;