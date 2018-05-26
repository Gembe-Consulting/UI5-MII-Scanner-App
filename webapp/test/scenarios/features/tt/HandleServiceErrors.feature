Feature: Service calls @ Time Tickets
	Detect and manage errors during service calls
		Structure for non-posting service calls
			1. emptyRequest: service returns empty Rowset (message strip)
			2. error: service returns Fatal Error (mesage stripx2)
			3. badRequest: service not available (message box + message stripx2)
		Structure for posting service calls
			1. error: service returns Fatal Error (mesage strip)
			2. badRequest: service not available (message box + message strip)	