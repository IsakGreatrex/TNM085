function x_next = Euler(x, t, h, f)
    % x = current state
    % t = current time
    % h = time step
    % f = derivative function
    x_next = x + h * f(x, t);
end