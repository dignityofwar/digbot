package interactor

type InteractionError struct {
	Err error
}

//func (e *PathError) Error() string { return e.Op + " " + e.Path + ": " + e.Err.Error() }
//
//func (e *PathError) Unwrap() error { return e.Err }
//
//// Timeout reports whether this error represents a timeout.
//func (e *PathError) Timeout() bool {
//	t, ok := e.Err.(interface{ Timeout() bool })
//	return ok && t.Timeout()
//}
